import { BaseModel } from "../model"
import { DB_EntrySchema } from "../schemas"

interface Entry {
  id: string
}

class EntryModelStatic<T extends Entry> extends BaseModel<"entities", T> {
  constructor() {
    super("entities", DB_EntrySchema)
  }

  async create(data: T) {
    return this.table.add({
      ...data,
    })
  }
}

export const entryModel = new EntryModelStatic()
