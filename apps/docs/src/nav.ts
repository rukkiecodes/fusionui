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

// The shape follows what you are trying to do, not how the code is organised:
// learn what this is (Introduction) → get it running (Getting Started) → learn
// what it gives you (Features, Styles, Concepts) → look things up (Components,
// API, Directives) → the volatile edge (Labs) → the project itself (About).
//
// Components are grouped by task rather than alphabetically: at 75 pages a flat
// list stops being navigable.
export const nav: NavSection[] = [
  {
    title: 'Introduction',
    items: [
      { title: 'Why FusionUI', to: '/introduction/why' },
      { title: 'Comparison', to: '/introduction/comparison' },
      { title: 'Roadmap', to: '/introduction/roadmap' },
    ],
  },
  {
    title: 'Getting Started',
    items: [
      { title: 'Installation', to: '/getting-started/installation' },
      { title: 'Quick Start', to: '/getting-started/quick-start' },
      { title: 'Frameworks', to: '/getting-started/frameworks' },
      { title: 'Native (mobile)', to: '/getting-started/native' },
    ],
  },
  {
    title: 'Features',
    items: [
      { title: 'Design Tokens', to: '/getting-started/design-tokens' },
      { title: 'Theme & Colors', to: '/getting-started/theme' },
      { title: 'Icons', to: '/getting-started/icons' },
      { title: 'Layout System', to: '/features/layout' },
      { title: 'Defaults & Config', to: '/features/defaults' },
      { title: 'Services', to: '/features/services' },
      { title: 'Accessibility', to: '/features/accessibility' },
      { title: 'SSR & Hydration', to: '/features/ssr' },
      { title: 'Performance', to: '/features/performance' },
    ],
  },
  {
    title: 'Styles & Animations',
    items: [
      { title: 'Colors', to: '/styles/colors' },
      { title: 'Typography', to: '/styles/typography' },
      { title: 'Motion & Transitions', to: '/styles/motion' },
      { title: 'Cascade Layers', to: '/styles/layers' },
      {
        title: 'Utility classes',
        items: [
          { title: 'Flexbox', to: '/utilities/flexbox' },
          { title: 'Spacing', to: '/utilities/spacing' },
          { title: 'Sizing', to: '/utilities/sizing' },
          { title: 'Display', to: '/utilities/display' },
          { title: 'Text & Typography', to: '/utilities/text' },
          { title: 'Borders', to: '/utilities/borders' },
          { title: 'Elevation', to: '/utilities/elevation' },
          { title: 'Position', to: '/utilities/position' },
          { title: 'Opacity', to: '/utilities/opacity' },
        ],
      },
    ],
  },
  {
    title: 'Common Concepts',
    items: [
      { title: 'Variants', to: '/concepts/variants' },
      { title: 'Size & Density', to: '/concepts/density' },
      { title: 'Slots & Composition', to: '/concepts/slots' },
      { title: 'Two-way Binding', to: '/concepts/v-model' },
      { title: 'Form Validation', to: '/concepts/validation' },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        title: 'Layout & Surfaces',
        items: [
          { title: 'Grid', to: '/components/grid' },
          { title: 'Layout', to: '/components/layout' },
          { title: 'Sheet', to: '/components/sheet' },
          { title: 'Card', to: '/components/card' },
          { title: 'Divider & Spacer', to: '/components/divider' },
          { title: 'Expansion Panels', to: '/components/expansion-panels' },
          { title: 'Collapse', to: '/components/collapse' },
          { title: 'Page Blocks', to: '/components/blocks' },
          { title: 'Auth Layout', to: '/components/auth-layout' },
        ],
      },
      {
        title: 'Buttons & Actions',
        items: [
          { title: 'Button', to: '/components/button' },
          { title: 'Icon Button', to: '/components/icon-button' },
          { title: 'FAB & Speed Dial', to: '/components/fab' },
          { title: 'Selection Groups', to: '/components/item-group' },
        ],
      },
      {
        title: 'Form Inputs',
        items: [
          { title: 'Text Input', to: '/components/inputs' },
          { title: 'Select', to: '/components/select' },
          { title: 'Autocomplete & Combobox', to: '/components/autocomplete' },
          { title: 'Checkbox', to: '/components/checkbox' },
          { title: 'Radio', to: '/components/radio' },
          { title: 'Switch', to: '/components/switch' },
          { title: 'Slider', to: '/components/slider' },
          { title: 'Range Slider', to: '/components/range-slider' },
          { title: 'Rating', to: '/components/rating' },
          { title: 'OTP Input', to: '/components/otp' },
          { title: 'File Upload', to: '/components/upload' },
          { title: 'Date Picker', to: '/components/date-picker' },
          { title: 'Time Picker', to: '/components/time-picker' },
          { title: 'Color Picker', to: '/components/color-picker' },
          { title: 'Confirm Edit', to: '/components/confirm-edit' },
          { title: 'Form & Validation', to: '/components/form' },
          { title: 'Labels & Messages', to: '/components/form-chrome' },
        ],
      },
      {
        title: 'Data',
        items: [
          { title: 'Data Table', to: '/components/data-table' },
          { title: 'Data Iterator', to: '/components/data-iterator' },
          { title: 'Table', to: '/components/table' },
          { title: 'List', to: '/components/list' },
          { title: 'Treeview', to: '/components/treeview' },
          { title: 'Timeline', to: '/components/timeline' },
          { title: 'Calendar', to: '/components/calendar' },
          { title: 'Virtual & Infinite Scroll', to: '/components/virtual-scroll' },
          { title: 'Chart', to: '/components/chart' },
          { title: 'Sparkline', to: '/components/sparkline' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { title: 'Navbar', to: '/components/navbar' },
          { title: 'Sidebar', to: '/components/sidebar' },
          { title: 'Bottom Navigation', to: '/components/bottom-nav' },
          { title: 'System Bar', to: '/components/system-bar' },
          { title: 'Footer', to: '/components/footer' },
          { title: 'Tabs', to: '/components/tabs' },
          { title: 'Breadcrumb', to: '/components/breadcrumb' },
          { title: 'Pagination', to: '/components/pagination' },
          { title: 'Steps', to: '/components/steps' },
          { title: 'Window', to: '/components/window' },
          { title: 'Slide Group', to: '/components/slide-group' },
        ],
      },
      {
        title: 'Feedback & Overlays',
        items: [
          { title: 'Alert', to: '/components/alert' },
          { title: 'Banner', to: '/components/banner' },
          { title: 'Notification', to: '/components/notification' },
          { title: 'Dialog', to: '/components/dialog' },
          { title: 'Bottom Sheet', to: '/components/bottom-sheet' },
          { title: 'Overlay & Popup', to: '/components/overlay' },
          { title: 'Menu', to: '/components/menu' },
          { title: 'Tooltip', to: '/components/tooltip' },
          { title: 'Loading', to: '/components/loading' },
          { title: 'Skeleton', to: '/components/skeleton' },
          { title: 'Empty State', to: '/components/empty-state' },
        ],
      },
      {
        title: 'Display',
        items: [
          { title: 'Avatar', to: '/components/avatar' },
          { title: 'Badge', to: '/components/badge' },
          { title: 'Chip', to: '/components/chip' },
          { title: 'Image', to: '/components/image' },
          { title: 'Carousel', to: '/components/carousel' },
          { title: 'Parallax', to: '/components/parallax' },
          { title: 'Keyboard & Code', to: '/components/kbd' },
        ],
      },
      {
        title: 'Utilities',
        items: [
          { title: 'Rendering Utilities', to: '/components/rendering' },
          { title: 'Theme & Defaults', to: '/components/providers' },
          { title: 'Pull to Refresh', to: '/components/pull-to-refresh' },
        ],
      },
    ],
  },
  {
    title: 'API',
    items: [
      { title: 'API Reference', to: '/api/' },
      { title: 'Composables', to: '/api/composables' },
    ],
  },
  {
    title: 'AI Agents',
    items: [{ title: 'Install the skill', to: '/ai/skill' }],
  },
  {
    title: 'Directives',
    items: [
      { title: 'v-ripple', to: '/directives/ripple' },
      { title: 'v-click-outside', to: '/directives/click-outside' },
      { title: 'v-intersect', to: '/directives/intersect' },
    ],
  },
  {
    title: 'Labs',
    items: [
      { title: 'What is Labs?', to: '/labs/' },
      { title: 'Liquid Glass', to: '/components/liquid-glass' },
      { title: 'Goo', to: '/components/goo' },
    ],
  },
  {
    title: 'Examples',
    items: [{ title: 'Dashboard', to: '/examples/dashboard' }],
  },
  {
    title: 'About',
    items: [
      { title: 'Changelog', to: '/about/changelog' },
      { title: 'Contributing', to: '/about/contributing' },
      { title: 'License', to: '/about/license' },
    ],
  },
]
