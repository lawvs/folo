import { entryModel } from "@renderer/core/database/models"
import type { EntryModel } from "@renderer/models/types"

class EntryServiceStatic {
  async create(data: EntryModel) {
    return entryModel.create(data)
  }
}

export const EntryService = new EntryServiceStatic()
