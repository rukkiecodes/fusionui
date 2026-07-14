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

// The component set is large enough that a single flat list stops being
// navigable, so components are grouped by what you are trying to *do* — lay
// something out, collect input, show data — rather than alphabetically.
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
    title: 'Signature Layer',
    items: [
      { title: 'Liquid Glass', to: '/components/liquid-glass' },
      { title: 'Goo', to: '/components/goo' },
      { title: 'Shaders', to: '/components/shaders' },
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
  {
    title: 'Examples',
    items: [{ title: 'Dashboard', to: '/examples/dashboard' }],
  },
]
