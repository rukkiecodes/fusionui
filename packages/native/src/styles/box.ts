/**
 * `boxStyle` — maps FusionUI utility props to a React Native style object,
 * the native replacement for the web's utility classes (`d-flex`, `p-4`,
 * `ga-2`…). Values resolve from the theme's spacing scale and radii, so nothing
 * is hard-coded.
 *
 * Pure (type-only RN import, erased at runtime) so it's unit-testable; the
 * `<FBox>` component that applies it lives in ./hooks.
 */

import type { ViewStyle } from 'react-native'
import type { FusionTheme } from '../theme/tokens'

/** Spacing scale key (1–7 or 'spacer'), or a raw number of dp. */
export type SpaceKey = keyof FusionTheme['space'] | number
export type RadiusKey = keyof FusionTheme['radius']

export interface FBoxProps {
  /** Lay children out in a row instead of a column. */
  row?: boolean
  /** flex grow/shrink value. */
  flex?: number
  /** Gap between children (spacing key). */
  gap?: SpaceKey
  /** Padding (spacing key). p = all, px/py = axes, pt/pr/pb/pl = sides. */
  p?: SpaceKey
  px?: SpaceKey
  py?: SpaceKey
  pt?: SpaceKey
  pr?: SpaceKey
  pb?: SpaceKey
  pl?: SpaceKey
  /** Margin (spacing key). */
  m?: SpaceKey
  mx?: SpaceKey
  my?: SpaceKey
  /** Corner radius (radius token key). */
  radius?: RadiusKey
  /** Background — a theme colour name or a raw colour. */
  bg?: string
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

const ALIGN = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const
const JUSTIFY = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
} as const

export function boxStyle(theme: FusionTheme, p: FBoxProps): ViewStyle {
  // A number or string is first tried as a spacing-scale key (so `gap={2}` is
  // the scale step, matching the web `ga-2`); anything not on the scale is used
  // as a raw dp value (`px={12}` → 12dp).
  const sp = (k?: SpaceKey): number | undefined => {
    if (k == null) return undefined
    const scaled = (theme.space as Record<string, number>)[String(k)]
    if (scaled != null) return scaled
    return typeof k === 'number' ? k : Number(k)
  }

  const style: ViewStyle = {}
  if (p.row) style.flexDirection = 'row'
  if (p.flex != null) style.flex = p.flex
  if (p.gap != null) style.gap = sp(p.gap)
  if (p.p != null) style.padding = sp(p.p)
  if (p.px != null) style.paddingHorizontal = sp(p.px)
  if (p.py != null) style.paddingVertical = sp(p.py)
  if (p.pt != null) style.paddingTop = sp(p.pt)
  if (p.pr != null) style.paddingRight = sp(p.pr)
  if (p.pb != null) style.paddingBottom = sp(p.pb)
  if (p.pl != null) style.paddingLeft = sp(p.pl)
  if (p.m != null) style.margin = sp(p.m)
  if (p.mx != null) style.marginHorizontal = sp(p.mx)
  if (p.my != null) style.marginVertical = sp(p.my)
  if (p.radius != null) style.borderRadius = theme.radius[p.radius]
  if (p.bg != null) style.backgroundColor = theme.colors[p.bg] ?? p.bg
  if (p.align != null) style.alignItems = ALIGN[p.align]
  if (p.justify != null) style.justifyContent = JUSTIFY[p.justify]
  return style
}
