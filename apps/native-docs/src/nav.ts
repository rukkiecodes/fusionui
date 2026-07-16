import { componentsByCategory } from './manifest'

export interface NavItem {
  title: string
  to?: string
  items?: NavItem[]
}
export interface NavSection {
  title: string
  items: NavItem[]
}

// The component groups are generated from the manifest, so a new registry entry
// appears in the sidebar automatically — categories become nested groups.
const componentSection: NavSection = {
  title: 'Components',
  items: componentsByCategory().map(({ category, items }) => ({
    title: category,
    items: items.map(c => ({ title: c.title, to: `/components/${c.slug}` })),
  })),
}

export const nav: NavSection[] = [
  {
    title: 'Get started',
    items: [
      { title: 'Overview', to: '/' },
      { title: 'Installation', to: '/install' },
      { title: 'Styles & tokens', to: '/styles' },
      { title: 'All components', to: '/components' },
    ],
  },
  componentSection,
  {
    title: 'Reference',
    items: [
      { title: 'Component parity', to: '/parity' },
      { title: 'Liquid glass', to: '/liquid-glass' },
    ],
  },
]

// The sibling web (Vue) documentation — linked from the navbar, opened in place.
export const WEB_DOCS_URL = 'https://rukkiecodes.github.io/fusionui/'
