import { BaseModel } from "../model"
import { DB_EntrySchema } from "../schemas"

interface Entry {
  id: string

}

class EntryModelStatic extends BaseModel {
  constructor() {
    super("entities", DB_EntrySchema)
  }

  async create(data: Entry) {
    return this.table.add({
      ...data,

    })
  }
}

export const EntryModel = new EntryModelStatic()
