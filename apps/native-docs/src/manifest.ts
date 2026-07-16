// Typed view over the generated snack manifest (snacks/manifest.json), produced by
// scripts/gen-snacks.mjs from the registry. Drives the nav and the dynamic
// /components/:slug page, so adding a component is a registry edit — nothing here.
import raw from '../snacks/manifest.json'

export interface ApiRow {
  prop: string
  type: string
  default?: string
}
export interface Variant {
  id: string
  title: string
  blurb: string
  snack: string
  deps: string
  height: number
}
export interface ComponentDoc {
  slug: string
  component: string
  title: string
  category: string
  description: string
  web: string
  api: ApiRow[]
  variants: Variant[]
}

export const components = raw as ComponentDoc[]

export function findComponent(slug: string): ComponentDoc | undefined {
  return components.find(c => c.slug === slug)
}

// Category → components, in first-seen order (drives the sidebar grouping).
export function componentsByCategory(): { category: string; items: ComponentDoc[] }[] {
  const order: string[] = []
  const map = new Map<string, ComponentDoc[]>()
  for (const c of components) {
    if (!map.has(c.category)) {
      map.set(c.category, [])
      order.push(c.category)
    }
    map.get(c.category)!.push(c)
  }
  return order.map(category => ({ category, items: map.get(category)! }))
}
