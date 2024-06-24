import { z } from "zod"

export const DB_EntrySchema = z.object({})

export type DB_Entry = z.infer<typeof DB_EntrySchema>
