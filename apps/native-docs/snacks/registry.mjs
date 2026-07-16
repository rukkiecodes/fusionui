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
        deps: ['expo-linear-gradient'],
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
]
