// The single source of truth for the mobile component docs. Each entry maps a
// @rukkiecodes/native component to its page: category, prose, API table, and the
// per-variant snacks (each variant → its own generated Expo Snack). The generator
// (scripts/gen-snacks.mjs) reads this to emit snacks/gen/* and snacks/manifest.json,
// and the site's nav + dynamic [slug] page read the manifest.

export const components = [
  // ---------------------------------------------------------------- Actions
  {
    slug: 'button',
    component: 'FButton',
    title: 'Button',
    category: 'Actions',
    web: '<f-btn>',
    part: 'FButton',
    // The mirror always imports LinearGradient (the gradient variant), so every
    // button snack must declare the dep — not only the one that renders it.
    deps: ['expo-linear-gradient'],
    imports: ["import { LinearGradient } from 'expo-linear-gradient'"],
    description:
      'The primary call to action — the React Native sibling of the web `<f-btn>`, with the same variants, colours, sizes and states, and a Reanimated press spring.',
    api: [
      {
        prop: 'variant',
        type: 'elevated | flat | tonal | outlined | text | gradient',
        default: 'elevated',
      },
      { prop: 'color', type: 'primary | success | danger | warning | …', default: 'primary' },
      { prop: 'size', type: 'small | default | large', default: 'default' },
      { prop: 'loading', type: 'boolean', default: 'false' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
      { prop: 'block', type: 'boolean', default: 'false' },
      { prop: 'onPress', type: '() => void', default: '—' },
    ],
    variants: [
      {
        id: 'variants',
        title: 'Variants',
        blurb: 'elevated · flat · tonal · outlined · text · gradient — the six fills.',
        height: 300,
      },
      {
        id: 'colors',
        title: 'Colors',
        blurb: 'Any theme colour resolves the fill and its on-colour label.',
        height: 240,
      },
      {
        id: 'sizes',
        title: 'Sizes',
        blurb: 'small · default · large — padding, font and radius scale together.',
        height: 220,
      },
      {
        id: 'states',
        title: 'Loading & disabled',
        blurb: 'A dual-ring loader swaps the label; disabled dims and blocks the press.',
        height: 240,
      },
    ],
  },

  // --------------------------------------------------------------- Surfaces
  {
    slug: 'card',
    component: 'FCard',
    title: 'Card',
    category: 'Surfaces',
    web: '<f-card>',
    part: 'FCard',
    description:
      'A soft-shadow surface. Token-driven fill and radius; when given `onPress` it lifts on a spring — the native echo of the web hover lift.',
    api: [
      { prop: 'flat', type: 'boolean', default: 'false' },
      { prop: 'padding', type: 'number', default: '16' },
      { prop: 'radius', type: 'number', default: 'radius.lg (20)' },
      { prop: 'onPress', type: '() => void', default: '—' },
    ],
    variants: [
      {
        id: 'interactive',
        title: 'Interactive',
        blurb: 'Press and hold — the card rises and scales a hair on a spring.',
        height: 320,
      },
      {
        id: 'flat',
        title: 'Flat',
        blurb: 'No shadow: a quieter surface-2 fill with a hairline border.',
        height: 300,
      },
      {
        id: 'radius',
        title: 'Custom radius',
        blurb: 'Tighten the radius and compose freely inside.',
        height: 320,
      },
    ],
  },

  // ------------------------------------------------------------ Form controls
  {
    slug: 'input',
    component: 'FInput',
    title: 'Text input',
    category: 'Form controls',
    web: '<f-input>',
    part: 'FInput',
    description:
      'A filled text field. The 2px border smoothly colours to the accent on focus (danger on error) with a subtle lift, mirroring the web `<f-input>` / `<f-field>`.',
    api: [
      { prop: 'label', type: 'string', default: '—' },
      { prop: 'value / onChangeText', type: 'string / (v) => void', default: '—' },
      { prop: 'error', type: 'string', default: '—' },
      { prop: 'message', type: 'string', default: '—' },
      { prop: 'color', type: 'primary | success | …', default: 'primary' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
      { prop: 'secureTextEntry', type: 'boolean', default: 'false' },
    ],
    variants: [
      {
        id: 'basic',
        title: 'Basic',
        blurb: 'Labelled and bound — focus to see the accent slide in.',
        height: 260,
      },
      {
        id: 'message',
        title: 'Helper & success',
        blurb: 'A helper line, and a success accent when valid.',
        height: 320,
      },
      {
        id: 'error',
        title: 'Error',
        blurb: 'A danger border and message when validation fails.',
        height: 260,
      },
      {
        id: 'secure',
        title: 'Password & disabled',
        blurb: 'Secure entry, and a locked disabled field.',
        height: 320,
      },
    ],
  },
  {
    slug: 'switch',
    component: 'FSwitch',
    title: 'Switch',
    category: 'Form controls',
    web: '<f-switch>',
    part: 'FSwitch',
    description:
      'A springy token-driven toggle. The thumb translates on a spring with a touch of overshoot; the track crossfades to the accent colour.',
    api: [
      { prop: 'value / onValueChange', type: 'boolean / (v) => void', default: '—' },
      { prop: 'color', type: 'primary | success | danger | …', default: 'primary' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
    ],
    variants: [
      {
        id: 'basic',
        title: 'Bound state',
        blurb: 'A single toggle wired to component state.',
        height: 220,
      },
      {
        id: 'colors',
        title: 'Colors',
        blurb: 'The track fills with any theme colour when on.',
        height: 320,
      },
      {
        id: 'disabled',
        title: 'Disabled',
        blurb: 'Locked on and locked off — dimmed and unpressable.',
        height: 260,
      },
    ],
  },
  {
    slug: 'checkbox',
    component: 'FCheckbox',
    title: 'Checkbox',
    category: 'Form controls',
    web: '<f-checkbox>',
    part: 'FCheckbox',
    description:
      'A single boolean choice with a drawn check. Carries the `checkbox` accessibility role and checked/disabled state.',
    api: [
      { prop: 'value / onValueChange', type: 'boolean / (v) => void', default: '—' },
      { prop: 'label', type: 'string', default: '—' },
      { prop: 'color', type: 'primary | success | …', default: 'primary' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
    ],
    variants: [
      { id: 'basic', title: 'Bound', blurb: 'Tap the row or the box to toggle.', height: 220 },
      {
        id: 'colors',
        title: 'Colors',
        blurb: 'The filled box takes any theme colour.',
        height: 300,
      },
      {
        id: 'disabled',
        title: 'Disabled',
        blurb: 'Locked checked and unchecked states.',
        height: 240,
      },
    ],
  },
  {
    slug: 'radio',
    component: 'FRadio',
    title: 'Radio',
    category: 'Form controls',
    web: '<f-radio-group>',
    part: 'FRadio',
    description:
      'Single-choice selection. `FRadioGroup` takes `options` and emits the selected value; each `FRadio` draws one dot-in-ring control.',
    api: [
      { prop: 'value / onValueChange', type: 'string / (v) => void', default: '—' },
      { prop: 'options', type: '{ label, value }[]', default: '—' },
      { prop: 'color', type: 'primary | success | …', default: 'primary' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
    ],
    variants: [
      {
        id: 'group',
        title: 'Group',
        blurb: 'Bind a value; the group emits the choice.',
        height: 300,
      },
      {
        id: 'colors',
        title: 'Colors',
        blurb: 'The selected ring + dot take any theme colour.',
        height: 300,
      },
      {
        id: 'disabled',
        title: 'Disabled',
        blurb: 'A locked group that cannot change.',
        height: 260,
      },
    ],
  },

  // ------------------------------------------------------------- Data display
  {
    slug: 'chip',
    component: 'FChip',
    title: 'Chip',
    category: 'Data display',
    web: '<f-chip>',
    part: 'FChip',
    description:
      'A compact label or filter. Shares the variant/colour language of the button in a smaller, pill-shaped footprint.',
    api: [
      { prop: 'variant', type: 'tonal | outlined | elevated | flat', default: 'tonal' },
      { prop: 'color', type: 'primary | success | …', default: 'primary' },
      { prop: 'size', type: 'small | medium', default: 'medium' },
      { prop: 'onPress', type: '() => void', default: '—' },
    ],
    variants: [
      {
        id: 'variants',
        title: 'Variants',
        blurb: 'tonal · outlined · elevated · flat.',
        height: 220,
      },
      { id: 'colors', title: 'Colors', blurb: 'Every theme colour, as a tonal chip.', height: 220 },
      {
        id: 'sizes',
        title: 'Sizes',
        blurb: 'small · medium — padding and type scale.',
        height: 200,
      },
    ],
  },
  {
    slug: 'badge',
    component: 'FBadge',
    title: 'Badge',
    category: 'Data display',
    web: '<f-badge>',
    part: 'FBadge',
    description:
      'A count or status marker that pins to the corner of the element it wraps. Numbers cap at `max` (default 99 → "99+"); `dot` renders a bare indicator.',
    api: [
      { prop: 'content', type: 'string | number', default: '—' },
      { prop: 'color', type: 'danger | primary | …', default: 'danger' },
      { prop: 'dot', type: 'boolean', default: 'false' },
      { prop: 'max', type: 'number', default: '99' },
    ],
    variants: [
      {
        id: 'numeric',
        title: 'Numeric',
        blurb: 'A count pinned to an element, capped at max.',
        height: 220,
      },
      { id: 'dot', title: 'Dot', blurb: 'A bare status dot with no count.', height: 200 },
      { id: 'colors', title: 'Colors', blurb: 'Any theme colour for the badge fill.', height: 220 },
    ],
  },
  {
    slug: 'avatar',
    component: 'FAvatar',
    title: 'Avatar',
    category: 'Data display',
    web: '<f-avatar>',
    part: 'FAvatar',
    description:
      'A user or entity thumbnail: an image, or coloured initials when no image is set. A rounded square by default, or a full circle.',
    api: [
      { prop: 'image', type: 'string (uri)', default: '—' },
      { prop: 'text', type: 'string', default: '—' },
      { prop: 'color', type: 'primary | success | …', default: 'primary' },
      { prop: 'size', type: 'number (dp)', default: '44' },
      { prop: 'circle', type: 'boolean', default: 'false' },
    ],
    variants: [
      { id: 'image', title: 'Image', blurb: 'A remote image, clipped to the shape.', height: 240 },
      {
        id: 'initials',
        title: 'Initials',
        blurb: 'Coloured fallback initials from a name.',
        height: 220,
      },
      {
        id: 'shapes',
        title: 'Shapes & sizes',
        blurb: 'Rounded square vs circle, across sizes.',
        height: 240,
      },
    ],
  },
  {
    slug: 'progress',
    component: 'FProgress',
    title: 'Progress',
    category: 'Data display',
    web: '<f-progress>',
    part: 'FProgress',
    description:
      'A linear progress bar. The value clamps to the track; the fill animates smoothly to each new value.',
    api: [
      { prop: 'value', type: 'number', default: '0' },
      { prop: 'max', type: 'number', default: '100' },
      { prop: 'color', type: 'primary | success | …', default: 'primary' },
      { prop: 'height', type: 'number (dp)', default: '6' },
    ],
    variants: [
      {
        id: 'values',
        title: 'Values',
        blurb: 'Tap to advance — the fill animates to each value.',
        height: 260,
      },
      { id: 'colors', title: 'Colors', blurb: 'Any theme colour for the fill.', height: 240 },
    ],
  },
  {
    slug: 'divider',
    component: 'FDivider',
    title: 'Divider',
    category: 'Data display',
    web: '<f-divider>',
    part: 'FDivider',
    description:
      'A hairline rule between content. Horizontal by default (optionally inset), or vertical to separate a row.',
    api: [
      { prop: 'vertical', type: 'boolean', default: 'false' },
      { prop: 'inset', type: 'boolean', default: 'false' },
    ],
    variants: [
      {
        id: 'horizontal',
        title: 'Horizontal',
        blurb: 'Between rows, full-width or inset.',
        height: 260,
      },
      { id: 'vertical', title: 'Vertical', blurb: 'Separating items in a row.', height: 200 },
    ],
  },

  // --------------------------------------------------- Form controls (more)
  {
    slug: 'field',
    component: 'FField',
    title: 'Field',
    category: 'Form controls',
    web: '<f-field>',
    part: 'FField',
    description:
      'The label + message/error shell that wraps any control. `required` adds an asterisk; an error swaps the message to the danger colour.',
    api: [
      { prop: 'label', type: 'string', default: '—' },
      { prop: 'message', type: 'string', default: '—' },
      { prop: 'error', type: 'string', default: '—' },
      { prop: 'required', type: 'boolean', default: 'false' },
    ],
    variants: [
      {
        id: 'basic',
        title: 'Label & message',
        blurb: 'Wrap a control with a label and helper line.',
        height: 260,
      },
      {
        id: 'validation',
        title: 'Required & error',
        blurb: 'A required marker, and the danger error state.',
        height: 320,
      },
    ],
  },
  {
    slug: 'textarea',
    component: 'FTextarea',
    title: 'Textarea',
    category: 'Form controls',
    web: '<f-textarea>',
    part: 'FTextarea',
    description:
      'A multiline text field on the FField shell — label, message/error, and a growing height set by `rows`.',
    api: [
      { prop: 'label', type: 'string', default: '—' },
      { prop: 'value / onChangeText', type: 'string / (v) => void', default: '—' },
      { prop: 'rows', type: 'number', default: '4' },
      { prop: 'error', type: 'string', default: '—' },
    ],
    variants: [
      {
        id: 'basic',
        title: 'Basic',
        blurb: 'A labelled multiline field with a helper line.',
        height: 300,
      },
      {
        id: 'error',
        title: 'Error',
        blurb: 'A danger border and message on invalid input.',
        height: 300,
      },
    ],
  },
  {
    slug: 'form',
    component: 'FForm',
    title: 'Form',
    category: 'Form controls',
    web: '<f-form>',
    part: 'FForm',
    description:
      'A vertical container that spaces its fields evenly — compose fields and a submit action into a real form.',
    api: [
      { prop: 'gap', type: 'number', default: '16' },
      { prop: 'children', type: 'ReactNode', default: '—' },
    ],
    variants: [
      { id: 'basic', title: 'Sign in', blurb: 'Fields plus a springy submit button.', height: 380 },
    ],
  },
  {
    slug: 'otp',
    component: 'FOtp',
    title: 'OTP input',
    category: 'Form controls',
    web: '<f-otp>',
    part: 'FOtp',
    description:
      'A one-time-code field: a hidden input drives a row of cells, and the next empty cell is highlighted with the accent.',
    api: [
      { prop: 'value / onChangeText', type: 'string / (v) => void', default: '—' },
      { prop: 'length', type: 'number', default: '6' },
      { prop: 'color', type: 'primary | success | …', default: 'primary' },
    ],
    variants: [
      {
        id: 'basic',
        title: 'Six digits',
        blurb: 'Tap to focus, then type — digits fill the cells.',
        height: 280,
      },
      {
        id: 'length',
        title: 'Four digits',
        blurb: 'Any length via the `length` prop.',
        height: 260,
      },
    ],
  },

  // ---------------------------------------------------- Data display (more)
  {
    slug: 'list',
    component: 'FList',
    title: 'List',
    category: 'Data display',
    web: '<f-list>',
    part: 'FList',
    description:
      'A surface list of rows. Each `FListItem` takes leading/trailing slots and a title/subtitle, and presses when given `onPress`.',
    api: [
      { prop: 'FList divider', type: 'boolean', default: 'false' },
      { prop: 'FListItem title', type: 'string', default: '—' },
      { prop: 'FListItem subtitle', type: 'string', default: '—' },
      { prop: 'FListItem leading / trailing', type: 'ReactNode', default: '—' },
      { prop: 'FListItem onPress', type: '() => void', default: '—' },
    ],
    variants: [
      { id: 'basic', title: 'Basic', blurb: 'Title + subtitle rows on a surface.', height: 280 },
      {
        id: 'rich',
        title: 'Leading & trailing',
        blurb: 'Avatars, values and chevrons in the slots.',
        height: 320,
      },
      { id: 'dividers', title: 'Dividers', blurb: 'Inset hairlines between rows.', height: 300 },
    ],
  },

  // -------------------------------------------------------------- Feedback
  {
    slug: 'alert',
    component: 'FAlert',
    title: 'Alert',
    category: 'Feedback',
    web: '<f-alert>',
    part: 'FAlert',
    deps: ['expo-linear-gradient'],
    imports: ["import { LinearGradient } from 'expo-linear-gradient'"],
    description:
      'An inline message. `type` sets colour + glyph; `variant` sets the fill; `closable` fades it out on a Reanimated dismiss, and `progress` animates a bottom bar.',
    api: [
      { prop: 'type', type: 'success | info | warning | error', default: '—' },
      {
        prop: 'variant',
        type: 'default | solid | border | shadow | flat | gradient | relief',
        default: 'default',
      },
      { prop: 'title', type: 'string', default: '—' },
      { prop: 'text', type: 'string', default: '—' },
      { prop: 'closable', type: 'boolean', default: 'false' },
      { prop: 'progress', type: 'number (0–100)', default: '0' },
    ],
    variants: [
      {
        id: 'types',
        title: 'Types',
        blurb: 'success · info · warning · error — colour and glyph.',
        height: 420,
      },
      {
        id: 'variants',
        title: 'Variants',
        blurb: 'default · solid · border · shadow · flat · gradient · relief.',
        height: 860,
      },
      {
        id: 'closable',
        title: 'Closable',
        blurb: 'Tap ✕ to fade it out; reset to bring them back.',
        height: 340,
      },
      {
        id: 'progress',
        title: 'Progress',
        blurb: 'An animated bottom bar tracks a value.',
        height: 300,
      },
    ],
  },
  {
    slug: 'tooltip',
    component: 'FTooltip',
    title: 'Tooltip',
    category: 'Feedback',
    web: '<f-tooltip>',
    part: 'FTooltip',
    description:
      'A hint shown on long-press. Touch has no hover, so the native contract is long-press → a small popover (a documented platform divergence).',
    api: [
      { prop: 'text', type: 'string', default: '—' },
      { prop: 'children', type: 'ReactNode (the trigger)', default: '—' },
      { prop: 'delay', type: 'number (ms)', default: '300' },
    ],
    variants: [
      {
        id: 'basic',
        title: 'Long-press',
        blurb: 'Press and hold the tile to reveal the tip.',
        height: 300,
      },
    ],
  },
  {
    slug: 'skeleton',
    component: 'FSkeleton',
    title: 'Skeleton',
    category: 'Feedback',
    web: '<f-skeleton>',
    part: 'FSkeleton',
    description:
      'A reduced-motion-aware opacity pulse standing in for content that has not loaded. Compose primitives into a placeholder for any layout.',
    api: [
      { prop: 'width', type: 'number | string', default: "'100%'" },
      { prop: 'height', type: 'number', default: '16' },
      { prop: 'radius', type: 'number', default: '8' },
      { prop: 'circle', type: 'boolean', default: 'false' },
    ],
    variants: [
      {
        id: 'shapes',
        title: 'Shapes',
        blurb: 'Lines and a circle, pulsing together.',
        height: 260,
      },
      {
        id: 'card',
        title: 'Card placeholder',
        blurb: 'A media + text card, faked while loading.',
        height: 320,
      },
    ],
  },

  // -------------------------------------------------------------- Marketing
  {
    slug: 'stat',
    component: 'FStat',
    title: 'Stat',
    category: 'Marketing',
    web: '<f-stat>',
    part: 'FStat',
    description:
      'A headline metric with a label and optional icon — the building block of a stats row.',
    api: [
      { prop: 'value', type: 'string | number', default: '—' },
      { prop: 'label', type: 'string', default: '—' },
      { prop: 'color', type: 'primary | success | …', default: 'primary' },
      { prop: 'icon', type: 'ReactNode', default: '—' },
    ],
    variants: [
      { id: 'basic', title: 'Single', blurb: 'One metric with its label.', height: 220 },
      { id: 'row', title: 'Stats row', blurb: 'Several metrics across a card.', height: 240 },
    ],
  },
  {
    slug: 'feature',
    component: 'FFeature',
    title: 'Feature',
    category: 'Marketing',
    web: '<f-feature>',
    part: 'FFeature',
    description:
      'An icon tile, a title and supporting copy — the marketing "feature" block, grid-friendly.',
    api: [
      { prop: 'icon', type: 'ReactNode', default: '—' },
      { prop: 'title', type: 'string', default: '—' },
      { prop: 'text', type: 'string', default: '—' },
    ],
    variants: [
      { id: 'basic', title: 'Single', blurb: 'One feature with an icon tile.', height: 260 },
      { id: 'grid', title: 'Grid', blurb: 'Two features side by side.', height: 300 },
    ],
  },
  {
    slug: 'cta',
    component: 'FCta',
    title: 'CTA',
    category: 'Marketing',
    web: '<f-cta>',
    part: 'FCta',
    description:
      'A centred call-to-action panel (xl radius, tonal primary wash) with a title, copy and an action slot.',
    api: [
      { prop: 'title', type: 'string', default: '—' },
      { prop: 'text', type: 'string', default: '—' },
      { prop: 'children', type: 'ReactNode (the action)', default: '—' },
    ],
    variants: [
      {
        id: 'basic',
        title: 'Panel',
        blurb: 'Title, copy and a springy action button.',
        height: 320,
      },
    ],
  },
  {
    slug: 'hero',
    component: 'FHero',
    title: 'Hero',
    category: 'Marketing',
    web: '<f-hero>',
    part: 'FHero',
    description:
      'The page-top banner: an eyebrow, a large title, a subtitle, and a slot for actions.',
    api: [
      { prop: 'eyebrow', type: 'string', default: '—' },
      { prop: 'title', type: 'string', default: '—' },
      { prop: 'subtitle', type: 'string', default: '—' },
      { prop: 'children', type: 'ReactNode (actions)', default: '—' },
    ],
    variants: [
      { id: 'basic', title: 'Banner', blurb: 'Eyebrow, title, subtitle and a CTA.', height: 320 },
    ],
  },

  // ---------------------------------------------------------------- Effects
  {
    slug: 'liquid-glass',
    component: 'LiquidGlassView',
    title: 'Liquid glass',
    category: 'Effects',
    web: '<f-glass>',
    part: 'LiquidGlass',
    deps: ['@shopify/react-native-skia'],
    imports: ["import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web'"],
    description:
      'The signature effect — a refractive translucent slab over a live backdrop. Renders through Skia CanvasKit on the web (WithSkiaWeb); on device it is the GPU BackdropFilter / iOS 26 UIGlassEffect. Same SDF → Snell engine as the web.',
    api: [
      { prop: 'radius', type: 'number', default: '24' },
      { prop: 'options', type: 'GlassOptions', default: 'DEFAULT_GLASS_OPTIONS' },
      { prop: 'children', type: 'ReactNode (content above the slab)', default: '—' },
    ],
    variants: [
      {
        id: 'glass',
        title: 'Refraction slab',
        blurb: 'A blurred translucent panel over a colourful backdrop, with content above it.',
        height: 560,
      },
    ],
  },
  {
    slug: 'shell',
    component: 'FShell',
    title: 'App shell',
    category: 'Effects',
    web: 'navbar + sidebar',
    part: 'FShell',
    deps: ['@shopify/react-native-skia'],
    imports: ["import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web'"],
    description:
      'The app shell: a navbar + sidebar frame around recessed content. The junction where content meets the shell is the fluid goo corner — a convex fillet drawn on the GPU with Skia from the shared shell geometry (the same smin math as the web shell). The content stays ordinary RN views on top.',
    api: [
      { prop: 'navbar', type: 'ReactNode', default: '—' },
      { prop: 'sidebar', type: 'ReactNode', default: '—' },
      { prop: 'navbarHeight', type: 'number', default: '56' },
      { prop: 'sidebarWidth', type: 'number', default: '240' },
      { prop: 'cornerSize', type: 'number', default: '20' },
      { prop: 'shellColor / contentColor', type: 'string', default: 'surface / background' },
    ],
    variants: [
      {
        id: 'basic',
        title: 'Navbar + sidebar',
        blurb: 'A full app frame; the content nestles into the shell at the Skia goo corner.',
        height: 800,
      },
    ],
  },
]
