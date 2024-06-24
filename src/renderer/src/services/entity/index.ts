import { Models } from "@renderer/core/database/models"
import type { EntryModel } from "@renderer/models/types"

class EntryServiceStatic {
  async create(data: EntryModel) {
    return Models.EntryModel.create(data)
  }
}

export const EntryService = new EntryServiceStatic()
