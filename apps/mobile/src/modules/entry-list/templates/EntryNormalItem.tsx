import { FeedViewType } from "@follow/constants"
import { tracker } from "@follow/tracker"
import { cn, formatEstimatedMins, formatTimeToSeconds } from "@follow/utils"
import { memo, useCallback, useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"

import { useUISettingKey } from "@/src/atoms/settings/ui"
import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { preloadWebViewEntry } from "@/src/components/native/webview/EntryContentWebView"
import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { Image } from "@/src/components/ui/image/Image"
import { PlatformActivityIndicator } from "@/src/components/ui/loading/PlatformActivityIndicator"
import { ItemPressableStyle } from "@/src/components/ui/pressable/enum"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { NativePressable } from "@/src/components/ui/pressable/NativePressable"
import { PauseCuteFiIcon } from "@/src/icons/pause_cute_fi"
import { PlayCuteFiIcon } from "@/src/icons/play_cute_fi"
import { useNavigation } from "@/src/lib/navigation/hooks"
import { getAttachmentState, player } from "@/src/lib/player"
import { EntryDetailScreen } from "@/src/screens/(stack)/entries/[entryId]/EntryDetailScreen"
import { useEntry } from "@/src/store/entry/hooks"
import { getInboxFrom } from "@/src/store/entry/utils"
import { useFeed } from "@/src/store/feed/hooks"
import { useEntryTranslation } from "@/src/store/translation/hooks"

import { EntryItemContextMenu } from "../../context-menu/entry"
import { EntryItemSkeleton } from "../EntryListContentArticle"
import { EntryTranslation } from "./EntryTranslation"

export const EntryNormalItem = memo(
  ({ entryId, extraData, view }: { entryId: string; extraData: string; view: FeedViewType }) => {
    const entry = useEntry(entryId)
    const translation = useEntryTranslation(entryId)
    const from = getInboxFrom(entry)
    const feed = useFeed(entry?.feedId as string)
    const navigation = useNavigation()
    const handlePress = useCallback(() => {
      if (entry) {
        preloadWebViewEntry(entry)
        tracker.navigateEntry({
          feedId: entry.feedId!,
          entryId: entry.id,
        })

        navigation.pushControllerView(EntryDetailScreen, {
          entryId,
          view,
        })
      }
    }, [entryId, entry, navigation, view])

    const thumbnailRatio = useUISettingKey("thumbnailRatio")

    const coverImage = entry?.media?.[0]
    const image = coverImage?.url || (view === FeedViewType.Audios ? feed?.image : null)
    const blurhash = coverImage?.blurhash

    const audio = entry?.attachments?.find((attachment) =>
      attachment.mime_type?.startsWith("audio/"),
    )
    const audioState = getAttachmentState(extraData, audio)
    const isPlaying = audioState === "playing"
    const isLoading = audioState === "loading"

    const estimatedMins = useMemo(() => {
      const durationInSeconds = formatTimeToSeconds(audio?.duration_in_seconds)
      return durationInSeconds && Math.floor(durationInSeconds / 60)
    }, [audio?.duration_in_seconds])

    if (!entry) return <EntryItemSkeleton />

    return (
      <EntryItemContextMenu id={entryId} view={view}>
        <ItemPressable
          itemStyle={ItemPressableStyle.Plain}
          className={cn(
            view === FeedViewType.Notifications ? "p-2" : "p-4",
            "flex flex-row items-center pl-6",
          )}
          onPress={handlePress}
        >
          {!entry.read && (
            <View
              className={cn(
                "bg-red absolute left-2 size-2 rounded-full",
                view === FeedViewType.Notifications ? "top-[35]" : "top-[43]",
              )}
            />
          )}
          <View className="flex-1 space-y-2 self-start">
            <View className="mb-1 flex-row items-center gap-1.5 pr-2">
              <FeedIcon fallback feed={feed} size={view === FeedViewType.Notifications ? 14 : 16} />
              <Text numberOfLines={1} className="text-secondary-label shrink text-sm font-medium">
                {feed?.title || from || "Unknown feed"}
              </Text>
              <Text className="text-secondary-label text-xs font-medium">·</Text>
              {estimatedMins ? (
                <>
                  <Text className="text-secondary-label text-xs font-medium">
                    {formatEstimatedMins(estimatedMins)}
                  </Text>
                  <Text className="text-secondary-label text-xs font-medium">·</Text>
                </>
              ) : null}
              <RelativeDateTime
                date={entry.publishedAt}
                className="text-secondary-label text-xs font-medium"
              />
            </View>
            {!!entry.title && (
              <EntryTranslation
                numberOfLines={2}
                className={cn(
                  view === FeedViewType.Notifications ? "text-base" : "text-lg",
                  "text-label font-semibold",
                )}
                source={entry.title}
                target={translation?.title}
                showTranslation={!!entry.settings?.translation}
                inline
              />
            )}
            {view !== FeedViewType.Notifications && !!entry.description && (
              <EntryTranslation
                numberOfLines={2}
                className="text-secondary-label my-0 text-sm"
                source={entry.description}
                target={translation?.description}
                showTranslation={!!entry.settings?.translation}
                inline
              />
            )}
          </View>
          {view !== FeedViewType.Notifications && (
            <View className="relative ml-4">
              {image &&
                (thumbnailRatio === "square" ? (
                  <SquareImage image={image} blurhash={blurhash} />
                ) : (
                  <AspectRatioImage
                    blurhash={blurhash}
                    image={image}
                    height={coverImage?.height}
                    width={coverImage?.width}
                  />
                ))}

              {audio && (
                <NativePressable
                  className="absolute inset-0 flex items-center justify-center"
                  onPress={() => {
                    if (isLoading) return
                    if (isPlaying) {
                      player.pause()
                      return
                    }
                    player.play({
                      url: audio.url,
                      title: entry?.title,
                      artist: feed?.title,
                      artwork: image,
                    })
                  }}
                >
                  <View className="overflow-hidden rounded-full p-2">
                    <ThemedBlurView style={StyleSheet.absoluteFillObject} intensity={30} />
                    {isPlaying ? (
                      <PauseCuteFiIcon color="white" width={24} height={24} />
                    ) : isLoading ? (
                      <PlatformActivityIndicator />
                    ) : (
                      <PlayCuteFiIcon color="white" width={24} height={24} />
                    )}
                  </View>
                </NativePressable>
              )}
            </View>
          )}
        </ItemPressable>
      </EntryItemContextMenu>
    )
  },
)

EntryNormalItem.displayName = "EntryNormalItem"

const AspectRatioImage = ({
  image,
  blurhash,
  height = 96,
  width = 96,
}: {
  image: string
  blurhash?: string
  height?: number
  width?: number
}) => {
  if (height === width || !height || !width) {
    return <SquareImage image={image} blurhash={blurhash} />
  }
  // Calculate aspect ratio and determine dimensions
  // Ensure the larger dimension is capped at 96px while maintaining aspect ratio

  const aspect = height / width
  let scaledWidth, scaledHeight

  if (aspect > 1) {
    // Image is taller than wide
    scaledHeight = 96
    scaledWidth = scaledHeight / aspect
  } else {
    // Image is wider than tall or square
    scaledWidth = 96
    scaledHeight = scaledWidth * aspect
  }

  return (
    <View className="size-24 items-center justify-center">
      <View
        style={{
          width: scaledWidth,
          height: scaledHeight,
        }}
        className="overflow-hidden rounded-md"
      >
        <Image
          proxy={{
            width: 96,
          }}
          source={{
            uri: image,
          }}
          style={{
            width: scaledWidth,
            height: scaledHeight,
          }}
          transition={100}
          blurhash={blurhash}
          className="rounded-md"
          contentFit="cover"
          hideOnError
        />
      </View>
    </View>
  )
}

const SquareImage = ({ image, blurhash }: { image: string; blurhash?: string }) => {
  return (
    <Image
      proxy={{
        width: 96,
        height: 96,
      }}
      transition={100}
      source={{
        uri: image,
      }}
      blurhash={blurhash}
      className="size-24 overflow-hidden rounded-lg"
      contentFit="cover"
      hideOnError
    />
  )
}
