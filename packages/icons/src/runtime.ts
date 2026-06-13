import { h, mergeProps } from 'vue'
import type { FunctionalComponent } from 'vue'

// A Feather icon is represented as a list of SVG child nodes (tag + attributes).
// Feather icons are multi-node (path/line/circle/polyline/polygon/rect/ellipse),
// so we keep the full node list rather than a single `d` path string.
export type FeatherIconNode = [tag: string, attrs: Record<string, string>]

export type FeatherIcon = FunctionalComponent

const SVG_BASE = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
}

function toPascal(name: string): string {
  return name
    .split(/[^a-z0-9]+/i)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * Builds a tree-shakeable functional component for a single Feather icon. The
 * SVG sizes to `1em` so the parent `<FIcon>` controls size via `font-size` and
 * color via `currentColor`.
 */
export function createFeatherIcon(name: string, nodes: FeatherIconNode[]): FeatherIcon {
  const Icon: FunctionalComponent = (_props, { attrs }) =>
    h(
      'svg',
      mergeProps(SVG_BASE, { class: ['fui-feather', `fui-feather-${name}`] }, attrs),
      nodes.map(([tag, nodeAttrs], i) => h(tag, { key: i, ...nodeAttrs }))
    )
  Icon.displayName = `Feather${toPascal(name)}`
  Icon.inheritAttrs = false
  return Icon
}
