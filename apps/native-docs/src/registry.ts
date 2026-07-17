// The mobile docs read the CLI's real source of truth — the copy-in registry at
// packages/native/registry — and merge in the docs-only metadata (props, usage,
// preview). Add a component to the registry and it shows up here automatically.
import registryJson from '../../../packages/native/registry/registry.json'
import snackIds from './snack-ids.json'
import { docsMeta, type ApiRow } from './docs-meta'

interface RegistryEntry {
  title: string
  category: string
  description: string
  files: string[]
  dependencies?: string[]
  peerDependencies?: string[]
}
const reg = registryJson as {
  name: string
  version: string
  description: string
  components: Record<string, RegistryEntry>
}

export const registryName = reg.name

export interface ComponentDoc {
  slug: string
  title: string
  category: string
  description: string
  files: string[]
  dependencies: string[]
  peerDependencies: string[]
  api: ApiRow[]
  usage: string
  snackId?: string
  snackPlatform: 'web' | 'mydevice'
}

export const components: ComponentDoc[] = Object.entries(reg.components).map(([slug, c]) => ({
  slug,
  title: c.title,
  category: c.category,
  description: c.description,
  files: c.files,
  dependencies: c.dependencies ?? [],
  peerDependencies: c.peerDependencies ?? [],
  api: docsMeta[slug]?.api ?? [],
  usage: docsMeta[slug]?.usage ?? '',
  snackId: (snackIds as Record<string, string>)[slug],
  snackPlatform: docsMeta[slug]?.snackPlatform ?? 'web',
}))

export function findComponent(slug: string): ComponentDoc | undefined {
  return components.find(c => c.slug === slug)
}

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

/** `npx @rukkiecodes/native add <slug>` — the copy-in command for a component. */
export function addCommand(slug: string): string {
  return `npx ${reg.name} add ${slug}`
}

/** The `expo install` line for a component's non-React dependencies, if any. */
export function installCommand(c: ComponentDoc): string {
  const deps = [
    ...c.dependencies,
    ...c.peerDependencies.filter(d => d !== 'react' && d !== 'react-native'),
  ]
  const unique = [...new Set(deps)]
  return unique.length ? `npx expo install ${unique.join(' ')}` : ''
}
