export interface NavItem {
  title: string
  /** A page link. Omitted when the item is a nested group (has `items`). */
  to?: string
  /** Nested sub-group items. */
  items?: NavItem[]
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
      { title: 'Native (mobile)', to: '/getting-started/native' },
      { title: 'Icons', to: '/getting-started/icons' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Grid', to: '/components/grid' },
      { title: 'Button', to: '/components/button' },
      { title: 'Card', to: '/components/card' },
      { title: 'Alert', to: '/components/alert' },
      { title: 'Avatar', to: '/components/avatar' },
      { title: 'Image', to: '/components/image' },
      { title: 'Carousel', to: '/components/carousel' },
      {
        title: 'Form Inputs',
        items: [
          { title: 'Text Input', to: '/components/inputs' },
          { title: 'Select', to: '/components/select' },
          { title: 'Checkbox', to: '/components/checkbox' },
          { title: 'Radio', to: '/components/radio' },
          { title: 'Switch', to: '/components/switch' },
          { title: 'OTP Input', to: '/components/otp' },
        ],
      },
      { title: 'Loading', to: '/components/loading' },
      { title: 'Notification', to: '/components/notification' },
      { title: 'Dialog', to: '/components/dialog' },
      { title: 'Menu', to: '/components/menu' },
      { title: 'Tooltip', to: '/components/tooltip' },
      { title: 'Navbar', to: '/components/navbar' },
      { title: 'Sidebar', to: '/components/sidebar' },
      { title: 'Layout', to: '/components/layout' },
      { title: 'Auth Layout', to: '/components/auth-layout' },
      { title: 'Liquid Glass', to: '/components/liquid-glass' },
      { title: 'Goo', to: '/components/goo' },
      { title: 'Shaders', to: '/components/shaders' },
      { title: 'Chart', to: '/components/chart' },
    ],
  },
  {
    title: 'Examples',
    items: [{ title: 'Dashboard', to: '/examples/dashboard' }],
  },
]
