import { Logo } from "@follow/components/icons/logo.jsx"
import { MdiMeditation } from "@follow/components/icons/Meditation.js"
import { ActionButton } from "@follow/components/ui/button/index.js"
import { Popover, PopoverContent, PopoverTrigger } from "@follow/components/ui/popover/index.jsx"
import { stopPropagation } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import { m } from "motion/react"
import type { FC, PropsWithChildren } from "react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { toast } from "sonner"

import { setAppSearchOpen } from "~/atoms/app"
import { useGeneralSettingKey } from "~/atoms/settings/general"
import { useIsZenMode, useSetZenMode } from "~/atoms/settings/ui"
import { setTimelineColumnShow, useTimelineColumnShow } from "~/atoms/sidebar"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useI18n } from "~/hooks/common"
import { useContextMenu } from "~/hooks/common/useContextMenu"
import { ProfileButton } from "~/modules/user/ProfileButton"

const useBackHome = (timelineId?: string) => {
  const navigate = useNavigateEntry()

  return useCallback(
    (overvideTimelineId?: string) => {
      navigate({
        feedId: null,
        entryId: null,
        timelineId: overvideTimelineId ?? timelineId,
      })
    },
    [timelineId, navigate],
  )
}

export const TimelineColumnHeader = memo(() => {
  const timelineId = useRouteParamsSelector((s) => s.timelineId)
  const navigateBackHome = useBackHome(timelineId)
  const normalStyle = !window.electron || window.electron.process.platform !== "darwin"
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        "ml-5 mr-3 flex items-center",

        normalStyle ? "ml-4 justify-between" : "justify-end",
      )}
    >
      {normalStyle && (
        <LogoContextMenu>
          <div
            className="font-default relative flex items-center gap-1 text-lg font-semibold"
            onClick={(e) => {
              e.stopPropagation()
              navigateBackHome()
            }}
          >
            <Logo className="mr-1 size-6" />
            {APP_NAME}
          </div>
        </LogoContextMenu>
      )}
      <div className="relative flex items-center gap-2" onClick={stopPropagation}>
        <Link to="/discover" tabIndex={-1}>
          <ActionButton shortcut="Meta+T" tooltip={t("words.discover")}>
            <i className="i-mgc-add-cute-re text-theme-vibrancyFg size-5" />
          </ActionButton>
        </Link>
        <SearchTrigger />

        <ProfileButton method="modal" animatedAvatar />
        <LayoutActionButton />
      </div>
    </div>
  )
})

const LayoutActionButton = () => {
  const feedColumnShow = useTimelineColumnShow()

  const [animation, setAnimation] = useState({
    width: !feedColumnShow ? "auto" : 0,
  })
  const isZenMode = useIsZenMode()
  const setIsZenMode = useSetZenMode()
  useEffect(() => {
    setAnimation({
      width: !feedColumnShow ? "auto" : 0,
    })
  }, [feedColumnShow])

  const t = useI18n()

  if (feedColumnShow) return null

  return (
    <m.div initial={animation} animate={animation} className="overflow-hidden">
      <ActionButton
        tooltip={isZenMode ? t("zen.exit") : t("app.toggle_sidebar")}
        icon={
          isZenMode ? (
            <MdiMeditation />
          ) : (
            <i
              className={cn(
                !feedColumnShow
                  ? "i-mgc-layout-leftbar-open-cute-re"
                  : "i-mgc-layout-leftbar-close-cute-re",
                "text-theme-vibrancyFg",
              )}
            />
          )
        }
        onClick={() => {
          if (isZenMode) {
            setIsZenMode(false)
          } else {
            setTimelineColumnShow(!feedColumnShow)
          }
        }}
      />
    </m.div>
  )
}

const LogoContextMenu: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const logoRef = useRef<SVGSVGElement>(null)
  const t = useI18n()
  const contextMenuProps = useContextMenu({
    onContextMenu: () => {
      setOpen(true)
    },
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild {...contextMenuProps}>
        {children}
      </PopoverTrigger>
      <PopoverContent align="start" className="!p-1">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(logoRef.current?.outerHTML || "")
            setOpen(false)
            toast.success(t.common("app.copied_to_clipboard"))
          }}
          className={cn(
            "cursor-menu relative flex select-none items-center rounded-sm px-1 py-0.5 text-sm outline-none",
            "hover:bg-theme-item-hover focus-within:outline-transparent dark:hover:bg-neutral-800",
            "text-foreground/80 gap-2 [&_svg]:size-3",
          )}
        >
          <Logo ref={logoRef} />
          <span>{t("app.copy_logo_svg")}</span>
        </button>
      </PopoverContent>
    </Popover>
  )
}

// const SearchActionButton = () => {
//   const canSearch = useGeneralSettingKey("dataPersist")
//   const { t } = useTranslation()
//   if (!canSearch) return null
//   return (
//     <ActionButton
//       shortcut="Meta+K"
//       tooltip={t("words.search")}
//       onClick={() => setAppSearchOpen(true)}
//     >
//       <i className="i-mgc-search-2-cute-re size-5 text-theme-vibrancyFg" />
//     </ActionButton>
//   )
// }

const SearchTrigger = () => {
  const canSearch = useGeneralSettingKey("dataPersist")

  useHotkeys(
    "meta+k,ctrl+k",
    () => {
      setAppSearchOpen(true)
    },
    {
      enabled: canSearch,
      preventDefault: true,
    },
  )

  return null
}
