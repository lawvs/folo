import type { apiClient } from "@renderer/lib/api-fetch"
import type { EntryPopulated } from "@renderer/models"

type FeedId = string
type EntryId = string
type EntriesIdTable = Record<FeedId, EntryId[]>

export interface EntryState {
  /**
   * A map of feedId to entryIds
   */
  entries: EntriesIdTable
  /**
   * A map of entryId to entry
   */
  flatMapEntries: Record<FeedId, EntryPopulated>
  /**
   * A map of feedId to entryId set, to quickly check if an entryId is in the feed
   * The array is used to keep the order of the entries, and this set is used to quickly check if an entryId is in the feed
   */

  internal_feedId2entryIdSet: Record<FeedId, Set<EntryId>>
  // internal_updateSortIds: Record<FeedId, EntryId[]>
}

export interface EntryActions {
  fetchEntries: (params: {
    level?: string
    id?: number | string
    view?: number
    read?: boolean

    pageParam?: string
  }) => Promise<Awaited<ReturnType<typeof apiClient.entries.$post>>>
  fetchEntryById: (entryId: string) => Promise<EntryPopulated | undefined>
  upsertMany: (entries: EntryPopulated[]) => void

  optimisticUpdate: (entryId: string, changed: Partial<EntryPopulated>) => void
  optimisticUpdateManyByFeedId: (
    feedId: string,
    changed: Partial<EntryPopulated>
  ) => void
  optimisticUpdateAll: (changed: Partial<EntryPopulated>) => void
  getFlattenMapEntries: () => Record<string, EntryPopulated>
  markRead: (feedId: string, entryId: string, read: boolean) => void
  markReadByFeedId: (feedId: string) => void

  clear: () => void
}
