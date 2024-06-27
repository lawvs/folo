import type { EntryPopulated, FeedModel } from "@renderer/models"

export type UniversalItemProps = {
  entryId: string
  entryPreview?: EntryPopulated & {
    feeds: FeedModel
  }
  translation?: {
    title?: string
    description?: string
  } | null
}
