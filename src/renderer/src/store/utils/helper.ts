import { del, get, set } from "idb-keyval"
import { enableMapSet } from "immer"
import { stringifyAsync } from "yieldable-json"
import type { StateCreator, StoreApi } from "zustand"
import type { PersistOptions, PersistStorage } from "zustand/middleware"
import { persist } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import type { UseBoundStoreWithEqualityFn } from "zustand/traditional"
import { createWithEqualityFn } from "zustand/traditional"

declare const window: any
const stringifyAsyncPromisify = (data: any) => {
  const nextData = { ...data }
  nextData.state = { ...nextData.state }
  for (const key in nextData.state) {
    if (typeof nextData.state[key] === "function") {
      delete nextData.state[key]
    }
  }

  return new Promise((resolve) =>
    stringifyAsync(nextData, (err, data) => {
      if (err) {
        return resolve(null)
      }
      resolve(data)
    }),
  )
}

globalThis.setImmediate =
  globalThis.setImmediate || ((cb) => setTimeout(cb, 0))

type StorageSerializerOptions = {
  deserialize: (data: any) => any
  serialize: (data: any) => any
}

const createDbStorage: (
  options?: StorageSerializerOptions
) => PersistStorage<any> = (options) => ({
  getItem: async (name: string) => {
    const { deserialize } = options || {}
    const data = (await get(name)) || null
    if (data === null) {
      return null
    }

    const parsed = JSON.parse(data)

    return deserialize ? deserialize(parsed) : parsed
  },
  setItem: async (name, value) => {
    const { serialize } = options || {}

    await set(
      name,
      await stringifyAsyncPromisify(serialize ? serialize(value) : value),
    )
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
})
export const localStorage: PersistStorage<any> = {
  getItem: (name: string) => {
    const data = window.localStorage.getItem(name)

    if (data === null) {
      return null
    }

    return JSON.parse(data)
  },
  setItem: (name, value) => {
    window.localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    window.localStorage.removeItem(name)
  },
}
enableMapSet()
const zustandStorage = createDbStorage()

export const createZustandStore =
  <
    S,
    T extends StateCreator<
      S,
      [["zustand/persist", unknown]],
      []
    > = StateCreator<S, [["zustand/persist", unknown]], []>,
  >(
    name: string,
    options?: Partial<
      PersistOptions<S> & {
        disablePersist?: boolean
        transformWriteObject?: (data: { state: S }) => any
        transformReadObject?: (data: { state: S }) => any
      }
    >,
  ) =>
    (store: T) => {
      const {
        disablePersist = false,
        transformWriteObject,
        transformReadObject,
      } = options || {}

      const usedStorage =
      transformWriteObject && transformReadObject ?
        createDbStorage({
          serialize: transformWriteObject,
          deserialize: transformReadObject,
        }) :
        zustandStorage

      const newStore = !disablePersist ?
        createWithEqualityFn(
          persist<S>(store, {
            name,
            storage: usedStorage,
            ...options,
          }),
          shallow,
        ) :
        createWithEqualityFn(store as any, shallow)

      window.store = window.store || {}
      Object.assign(window.store, {
        [name]() {
          return newStore.getState()
        },
      })
      return newStore as unknown as UseBoundStoreWithEqualityFn<StoreApi<S>>
    }
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T]

type FunctionProps<T> = Pick<T, FunctionKeys<T>>
export const getStoreActions = <T extends { getState: () => any }>(
  store: T,
): FunctionProps<ReturnType<T["getState"]>> => {
  const actions = {}
  const state = store.getState()
  for (const key in state) {
    if (typeof state[key] === "function") {
      actions[key] = state[key]
    }
  }

  return actions as any
}

export const createStateTransformer = (
  typeMap: Record<string, "set" | "map">,
) => ({
  transformReadObject: (data) => {
    for (const key in typeMap) {
      if (!data.state[key]) {
        continue
      }

      if (typeMap[key] === "set") {
        data.state[key] = new Set(data.state[key])
      } else if (typeMap[key] === "map") {
        data.state[key] = new Map(
          data.state[key],
        )
      }
    }

    return data
  },
  transformWriteObject: (data) => {
    const nextData = { ...data }
    nextData.state = { ...nextData.state }

    for (const key in typeMap) {
      if (!nextData.state[key]) {
        continue
      }

      if (typeMap[key] === "set") {
        nextData.state[key] = Array.from(nextData.state[key])
      } else if (typeMap[key] === "map") {
        nextData.state[key] = Object.fromEntries(nextData.state[key])
      }
    }

    return nextData
  },
})
