import Dexie from "dexie"

import { LOCAL_DB_NAME } from "./constants"
import {
  dbSchemaV1,
} from "./db_schema"
import type { DB_Entry } from "./schemas/Entry"
import type { DBModel } from "./types"

export interface LobeDBSchemaMap {

  entities: DB_Entry
}

// Define a local DB
export class BrowserDB extends Dexie {
  public entities: BrowserDBTable<"entities">

  constructor() {
    super(LOCAL_DB_NAME)
    this.version(1).stores(dbSchemaV1)
    this.entities = this.table("entities")
  }
}

export const browserDB = new BrowserDB()

// ================================================ //
// ================================================ //
// ================================================ //
// ================================================ //
// ================================================ //

// types helper
export type BrowserDBSchema = {
  [t in keyof LobeDBSchemaMap]: {
    model: LobeDBSchemaMap[t]
    table: Dexie.Table<DBModel<LobeDBSchemaMap[t]>, string>
  };
}
type BrowserDBTable<T extends keyof LobeDBSchemaMap> = BrowserDBSchema[T]["table"]
