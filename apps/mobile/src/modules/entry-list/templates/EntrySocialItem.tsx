import { FeedViewType } from "@follow/constants"
import { tracker } from "@follow/tracker"
import { memo, useCallback, useMemo } from "react"
import { Pressable, Text, View } from "react-native"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { Galeria } from "@/src/components/ui/image/galeria"
import { Image } from "@/src/components/ui/image/Image"
import { ItemPressableStyle } from "@/src/components/ui/pressable/enum"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { useNavigation } from "@/src/lib/navigation/hooks"
import { EntryDetailScreen } from "@/src/screens/(stack)/entries/[entryId]/EntryDetailScreen"
import { FeedScreen } from "@/src/screens/(stack)/feeds/[feedId]/FeedScreen"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"
import { useEntryTranslation } from "@/src/store/translation/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

import { EntryItemContextMenu } from "../../context-menu/entry"
import { EntryItemSkeleton } from "../EntryListContentSocial"
import { EntryTranslation } from "./EntryTranslation"

export const EntrySocialItem = memo(({ entryId }: { entryId: string }) => {
  const entry = useEntry(entryId)
  const translation = useEntryTranslation(entryId)

  const feed = useFeed(entry?.feedId || "")

  const navigation = useNavigation()
  const handlePress = useCallback(() => {
    unreadSyncService.markEntryAsRead(entryId)
    tracker.navigateEntry({
      feedId: entry?.feedId!,
      entryId,
    })
    navigation.pushControllerView(EntryDetailScreen, {
      entryId,
      view: FeedViewType.SocialMedia,
    })
  }, [entry?.feedId, entryId, navigation])

  const autoExpandLongSocialMedia = useGeneralSettingKey("autoExpandLongSocialMedia")

  const memoedMediaUrlList = useMemo(() => {
    return (entry?.media
      ?.map((i) =>
        i.type === "video" ? i.preview_image_url : i.type === "photo" ? i.url : undefined,
      )
      .filter(Boolean) || []) as string[]
  }, [entry])

  if (!entry) return <EntryItemSkeleton />

  const { description, publishedAt, media } = entry

  return (
    <EntryItemContextMenu id={entryId} view={FeedViewType.SocialMedia}>
      <ItemPressable
        itemStyle={ItemPressableStyle.Plain}
        className="flex flex-col gap-2 p-4 pl-6"
        onPress={handlePress}
      >
        {!entry.read && <View className="bg-red absolute left-1.5 top-[25] size-2 rounded-full" />}

        <View className="flex flex-1 flex-row items-start gap-4">
          <Pressable
            hitSlop={10}
            onPress={() => {
              if (!entry.feedId) return
              navigation.pushControllerView(FeedScreen, {
                feedId: entry.feedId,
              })
            }}
          >
            {entry.authorAvatar ? (
              <UserAvatar size={28} name={entry.author ?? ""} image={entry.authorAvatar} />
            ) : (
              feed && <FeedIcon feed={feed} size={28} />
            )}
          </Pressable>

          <View className="flex-1 flex-row items-center gap-1.5">
            <Text numberOfLines={1} className="text-label shrink text-base font-semibold">
              {entry.author || feed?.title}
            </Text>
            <Text className="text-secondary-label">·</Text>
            <RelativeDateTime date={publishedAt} className="text-secondary-label text-[14px]" />
          </View>
        </View>

        <View className="relative -mt-4">
          <EntryTranslation
            numberOfLines={autoExpandLongSocialMedia ? undefined : 7}
            className="text-label ml-12 text-base"
            source={description}
            target={translation?.description}
            showTranslation={!!entry.settings?.translation}
          />
        </View>

        {media && media.length > 0 && (
          <View className="ml-10 flex flex-row flex-wrap justify-between">
            <Galeria urls={memoedMediaUrlList}>
              {media.map((mediaItem, index) => {
                // TODO: support video
                const imageUrl =
                  mediaItem.type === "video"
                    ? mediaItem.preview_image_url
                    : mediaItem.type === "photo"
                      ? mediaItem.url
                      : undefined
                const fullWidth = index === media.length - 1 && media.length % 2 === 1
                if (!imageUrl) return null
                return (
                  <Pressable
                    key={`${entryId}-${imageUrl}`}
                    className={fullWidth ? "w-full" : "w-1/2 p-0.5"}
                  >
                    <Galeria.Image index={index}>
                      <Image
                        proxy={{
                          width: fullWidth ? 400 : 200,
                        }}
                        source={{ uri: imageUrl }}
                        blurhash={mediaItem.blurhash}
                        className="border-secondary-system-background w-full rounded-lg border"
                        aspectRatio={
                          fullWidth && mediaItem.width && mediaItem.height
                            ? mediaItem.width / mediaItem.height
                            : 1
                        }
                      />
                    </Galeria.Image>
                  </Pressable>
                )
              })}
            </Galeria>
          </View>
        )}
      </ItemPressable>
    </EntryItemContextMenu>
  )
})

EntrySocialItem.displayName = "EntrySocialItem"
