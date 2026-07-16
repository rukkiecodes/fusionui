import { componentsByCategory } from './registry'

export interface NavItem {
  title: string
  to?: string
  items?: NavItem[]
}
export interface NavSection {
  title: string
  items: NavItem[]
}

// Component groups are generated from the registry, so a new copy-in component shows
// up in the sidebar automatically.
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
      { title: 'Getting started', to: '/install' },
      { title: 'All components', to: '/components' },
    ],
  },
  componentSection,
]

// The sibling web (Vue) documentation — linked from the navbar.
export const WEB_DOCS_URL = 'https://rukkiecodes.github.io/fusionui/'
