export interface NavItem {
  title: string
  to: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const nav: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', to: '/' },
      { title: 'Installation', to: '/getting-started/installation' },
      { title: 'Theme & Colors', to: '/getting-started/theme' },
      { title: 'Icons', to: '/getting-started/icons' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Button', to: '/components/button' },
      { title: 'Card', to: '/components/card' },
      { title: 'Alert', to: '/components/alert' },
      { title: 'Chip', to: '/components/chip' },
      { title: 'Form Inputs', to: '/components/inputs' },
      { title: 'Selection Controls', to: '/components/controls' },
      { title: 'Progress', to: '/components/progress' },
      { title: 'Navigation', to: '/components/navigation' },
      { title: 'Overlays', to: '/components/overlays' },
      { title: 'Data Table', to: '/components/data' },
      { title: 'Services', to: '/components/services' },
    ],
  },
  {
    title: 'Lab',
    items: [{ title: 'Playground', to: '/playground' }],
  },
]
