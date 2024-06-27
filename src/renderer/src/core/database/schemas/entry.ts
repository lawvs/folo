import { z } from "zod"

export const DB_EntrySchema = z.object({
  id: z.string(),
  publishedAt: z.string(),
  changedAt: z.string(),
})

export type DB_Entry = z.infer<typeof DB_EntrySchema>
