import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Flag1CuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const Flag1CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Flag1CuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        d="M8.489 3.042c-1.139.064-1.786.202-2.429.519-.718.354-1.147.783-1.498 1.499-.329.67-.451 1.26-.521 2.52-.023.421-.04 3.392-.04 7.143-.001 7.213-.025 6.655.298 6.978a.984.984 0 0 0 1.402 0c.307-.307.299-.224.299-3.127v-2.572l6.57-.012c5.785-.011 6.596-.02 6.79-.075.484-.136.809-.382 1.005-.763.132-.255.15-.734.04-1.059-.132-.388-.3-.645-1.599-2.433-.671-.924-1.271-1.76-1.333-1.858-.126-.198-.142-.35-.054-.52.033-.063.632-.904 1.333-1.868.7-.965 1.338-1.862 1.417-1.994.446-.743.409-1.506-.095-1.96-.183-.166-.396-.278-.703-.369-.213-.064-.621-.07-5.271-.075-2.772-.003-5.297.009-5.611.026"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  )
}
