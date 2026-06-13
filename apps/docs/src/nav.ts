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
      { title: 'Design Tokens', to: '/getting-started/design-tokens' },
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
      { title: 'Form Inputs', to: '/components/inputs' },
      { title: 'Navbar', to: '/components/navbar' },
      { title: 'Sidebar', to: '/components/sidebar' },
    ],
  },
]
