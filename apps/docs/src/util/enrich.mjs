// Pure, browser-safe markdown enrichment shared by the build-time generator
// (scripts/gen-ai-docs.mjs) and the in-page export (components/PageActions.vue),
// so the downloaded .md/.json is identical whether it's served as a static file
// or generated client-side. Callers supply the file lookups (Node fs vs Vite
// glob), keeping this module dependency-free.

const WIDGETS =
  'TokensCatalog|IconGallery|NativeSnack|ButtonPlayground|InputPlayground|CardPlayground|AlertPlayground|GlassPlayground|GooPlayground|ChartPlayground|DashboardExample|Markup'

function row(cells) {
  return '| ' + cells.join(' | ') + ' |\n'
}
const esc = s => (s || '').replace(/\|/g, '\\|')

export function apiTableMarkdown(name, api) {
  let out =
    `#### \`${name}\` props\n\n` +
    row(['Prop', 'Type', 'Default', 'Description']) +
    row(['---', '---', '---', '---'])
  for (const [prop, d] of Object.entries(api.props || {})) {
    out += row([
      `\`${prop}\``,
      `\`${d.type}\``,
      d.default != null ? `\`${d.default}\`` : '—',
      esc(d.description),
    ])
  }
  const events = Object.entries(api.events || {})
  if (events.length) {
    out += `\n**Events**\n\n` + row(['Event', 'Description']) + row(['---', '---'])
    for (const [e, d] of events) out += row([`\`${e}\``, esc(d.description)])
  }
  const slots = Object.entries(api.slots || {})
  if (slots.length) {
    out += `\n**Slots**\n\n` + row(['Slot', 'Description']) + row(['---', '---'])
    for (const [s, d] of slots) out += row([`\`${s}\``, esc(d.description)])
  }
  return out
}

/** Expand the docs-only `<Example>` / `<ApiTable>` tags into real code + tables.
 *  `resolveExample(file) -> string|null` (raw .vue source);
 *  `resolveApi(name) -> object|null` (parsed API JSON). */
export function enrich(md, resolveExample, resolveApi) {
  return md
    .replace(/<Example\s+file="([^"]+)"\s*\/>/g, (_, f) => {
      const src = resolveExample(f)
      return src ? '```vue\n' + src.trimEnd() + '\n```' : `> _(example \`${f}\`)_`
    })
    .replace(/<ApiTable\s+name="([^"]+)"\s*\/>/g, (_, n) => {
      const api = resolveApi(n)
      return api ? apiTableMarkdown(n, api) : `> _(API: ${n})_`
    })
    .replace(
      new RegExp(`<(${WIDGETS})\\b[^>]*?/?>`, 'g'),
      () => '> _(interactive demo — see the live docs)_'
    )
    .replace(new RegExp(`</(${WIDGETS})>`, 'g'), '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function titleOf(md) {
  const m = md.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : 'FusionUI'
}

export function descOf(md) {
  const body = md.replace(/^#\s+.+$/m, '')
  for (const line of body.split('\n')) {
    const t = line.trim()
    if (t && !/^[#<`-]/.test(t) && !t.startsWith('```')) {
      return t
        .replace(/[[\]`*]|\(([^)]*)\)/g, (_m, url) => url || '')
        .replace(/\s+/g, ' ')
        .slice(0, 180)
    }
  }
  return ''
}

/** Find the example/api references in a page so a client can preload them. */
export function references(md) {
  return {
    examples: [...md.matchAll(/<Example\s+file="([^"]+)"\s*\/>/g)].map(m => m[1]),
    apis: [...md.matchAll(/<ApiTable\s+name="([^"]+)"\s*\/>/g)].map(m => m[1]),
  }
}
