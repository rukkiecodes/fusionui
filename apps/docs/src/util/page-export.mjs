// Build a page's enriched markdown / JSON in the browser, so the Copy/Download
// buttons work in dev and prod alike (no dependency on the static files the
// build-time generator emits — those stay for crawlers). Uses the same enricher
// as scripts/gen-ai-docs.mjs, so the output is identical.
import { enrich, titleOf, descOf, references } from './enrich.mjs'

const pageMods = import.meta.glob('../pages/**/*.md', { query: '?raw', import: 'default' })
const exampleMods = import.meta.glob('../examples/**/*.vue', { query: '?raw', import: 'default' })
const apiMods = import.meta.glob('../api/*.json', { import: 'default' })

export async function buildPage(routePath) {
  const slug = routePath.replace(/^\/+|\/+$/g, '') || 'index'
  const loader = pageMods[`../pages/${slug}.md`]
  if (!loader) return null

  const raw = await loader()
  const { examples, apis } = references(raw)
  const ex = {}
  const api = {}
  await Promise.all([
    ...examples.map(async f => {
      const m = exampleMods[`../examples/${f}.vue`]
      if (m) ex[f] = await m()
    }),
    ...apis.map(async n => {
      const m = apiMods[`../api/${n}.json`]
      if (m) api[n] = await m()
    }),
  ])

  const md = enrich(
    raw,
    f => ex[f] ?? null,
    n => api[n] ?? null
  )
  const title = titleOf(raw)
  const url =
    typeof window !== 'undefined' ? window.location.origin + window.location.pathname : routePath
  return {
    slug,
    title,
    mdFull: `<!-- ${title} — FusionUI docs. Page: ${url} -->\n\n${md}\n`,
    json: { title, description: descOf(raw), route: routePath, url, markdown: md },
  }
}
