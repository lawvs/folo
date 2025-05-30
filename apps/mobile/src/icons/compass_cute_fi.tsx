import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CompassCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const CompassCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CompassCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        d="M11.28 2.024c-2.109.185-3.979.926-5.561 2.201-1.675 1.351-2.908 3.28-3.416 5.346-.216.881-.277 1.41-.277 2.429s.061 1.548.277 2.429c.886 3.607 3.839 6.502 7.457 7.311.844.189 1.287.236 2.24.236.953 0 1.396-.047 2.24-.236 3.618-.809 6.571-3.704 7.457-7.311.213-.869.276-1.413.278-2.409.001-.976-.043-1.404-.235-2.26-.458-2.049-1.658-4.025-3.26-5.369-1.824-1.531-3.915-2.321-6.26-2.368a15.89 15.89 0 0 0-.94.001m4.531 5.496c.833.258.975 1.258.416 2.929-.527 1.573-1.429 3.069-2.343 3.884-1.29 1.151-3.767 2.227-5.127 2.227-.686 0-1.084-.246-1.243-.77-.284-.936.292-2.86 1.384-4.624.778-1.256 1.592-1.968 3.163-2.768 1.542-.785 2.97-1.119 3.75-.878m-4.168 3.549c-.352.124-.643.545-.643.931 0 .527.473 1 1 1 .242 0 .521-.119.701-.299.753-.753-.048-1.989-1.058-1.632"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  )
}
