/**
 * FShell — the native app shell. The navbar + sidebar form a tinted frame around
 * the recessed content, and the junction where they meet the content is the same
 * fluid goo corner as the web (the content nestles in with a convex round; the
 * shell's inside corner carries the negative radius).
 *
 * The shapes come from the shared shell engine as renderer-agnostic path commands
 * and are drawn on the GPU with Skia (`buildSkiaPath`). The content — navbar
 * items, nav links, screens — stays ordinary React Native views on top, so the
 * usual accessibility, text and gestures are preserved.
 */
import React, { useMemo } from 'react'
import { View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import type { SkPath } from '@shopify/react-native-skia'
import { useFusionTheme } from '../theme'
import { shellCornerCommands, buildSkiaPath } from '../engine/shell'

export interface FShellProps {
  /** Top bar content (logo, actions). */
  navbar?: React.ReactNode
  /** Left column content (nav links). */
  sidebar?: React.ReactNode
  navbarHeight?: number
  sidebarWidth?: number
  /** Radius of the nestled content corner. */
  cornerSize?: number
  /** Frame colour (navbar + sidebar). Defaults to the theme surface. */
  shellColor?: string
  /** Recessed content colour. Defaults to the theme background. */
  contentColor?: string
  style?: StyleProp<ViewStyle>
  /** The content/screen, rendered as normal RN views over the recessed surface. */
  children?: React.ReactNode
}

export function FShell({
  navbar,
  sidebar,
  navbarHeight = 56,
  sidebarWidth = 240,
  cornerSize = 20,
  shellColor,
  contentColor,
  style,
  children,
}: FShellProps) {
  const theme = useFusionTheme()
  const shell = shellColor ?? theme.colors.surface
  const content = contentColor ?? theme.colors.background

  // The junction fillet, drawn once from the shared shell geometry.
  const cornerPath = useMemo(
    () => buildSkiaPath(Skia, shellCornerCommands(cornerSize)) as unknown as SkPath,
    [cornerSize]
  )

  return (
    <View style={[{ flex: 1, backgroundColor: shell }, style]}>
      {navbar != null ? (
        <View style={{ height: navbarHeight, backgroundColor: shell }}>{navbar}</View>
      ) : null}

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {sidebar != null ? (
          <View style={{ width: sidebarWidth, backgroundColor: shell }}>{sidebar}</View>
        ) : null}

        <View style={{ flex: 1, backgroundColor: content }}>
          {/* Goo junction: a shell-coloured fillet that carves the convex corner. */}
          <Canvas
            pointerEvents="none"
            style={{ position: 'absolute', left: 0, top: 0, width: cornerSize, height: cornerSize }}
          >
            <Path path={cornerPath} color={shell} />
          </Canvas>
          {children}
        </View>
      </View>
    </View>
  )
}
