import { useCallback, useRef } from "react"

import { m } from "~/components/common/Motion"

import { AnimatedCommandButton } from "./base"

export const CopyButton: Component<{
  value: string
  style?: React.CSSProperties
  variant?: "solid" | "outline" | "ghost"
}> = ({ value, className, style, variant = "solid" }) => {
  const copiedTimerRef = useRef<any>()
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)

    clearTimeout(copiedTimerRef.current)
  }, [value])
  return (
    <AnimatedCommandButton
      className={className}
      style={style}
      variant={variant}
      icon={<m.i className="i-mgc-copy-2-cute-re size-4" />}
      onClick={handleCopy}
    />
  )
}
