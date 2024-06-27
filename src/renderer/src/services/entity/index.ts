import { entryModel } from "@renderer/core/database/models"
import type { EntryModel } from "@renderer/models/types"

class EntryServiceStatic {
  async create(data: EntryModel) {
    return entryModel.create(data)
  }

  async upsert(data: EntryModel) {
    return entryModel.upsert(data)
  }

  async findAll() {
    return entryModel.table.toArray()
  }
}

export const EntryService = new EntryServiceStatic()
