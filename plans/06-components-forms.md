# Batch 06 — Components B: Form Controls

**Depends on:** 02, 03, 04 · **Parallel with:** 05, 07

## Goal
Port Vuesax's form controls — its **animated inputs** (floating placeholder,
focus glow, validation states) are a standout — onto the Vue 3 runtime with a
unified `v-model`, validation, and a shared form-field substrate.

## Components
`VdInput` (text), `VdTextarea`, `VdInputNumber`, `VdSelect`, `VdCheckbox`,
`VdRadio` (+ `VdRadioGroup`), `VdSwitch`, `VdSlider`, `VdUpload`, `VdForm` (+
validation), `VdField` (shared label/messages wrapper).

## Implementation notes

### Shared substrate: `VdField` + `useForm`/`useValidation`
- `VdField` renders label, control slot, helper/validation messages, and the
  state coloring (`success|warning|danger`) — factored out so every input reuses it.
- `useProxiedModel` (B02) for v-model on all controls.
- `makeValidationProps`: `rules` (array of validators), `error`, `errorMessages`,
  `success`, `successMessages`. Port Vuesax's per-input `success/danger/warning`
  + `*Text` props into this unified API.
- `VdForm` provides validation context, `validate()`/`reset()`/`resetValidation()`,
  exposes `isValid`.

### VdInput (the signature Vuesax animated input)
- `labelPlaceholder` behavior: label sits as placeholder, then slides up
  (`translateY(-90%)` + shrink to `.7rem`) on focus/filled — port exactly.
- Focus: border → theme color + soft focus shadow `0 3px 10px rgba(0,0,0,.15)`.
- `prependIcon`/`appendIcon` (Feather), `iconAfter`, clearable (`$clear`).
- Validation icon slides in (`scale(.5)` → 1) like Vuesax; messages animate height.
- `color`, `size` (`small|normal|large`), `disabled`, `loading`.

### VdSelect
- Built on a menu/overlay (reuse the overlay primitive from Batch 07's `VdMenu`).
  Single + `multiple` (chips via `VdChip`), `searchable`/filterable, `items`
  (array or object), `itemTitle`/`itemValue`, clearable. Keyboard nav + a11y roles.

### VdCheckbox / VdRadio / VdSwitch
- Custom-drawn controls (SVG check, ripple on toggle), theme color, indeterminate
  (checkbox), `VdRadioGroup` for grouping (use `group` composable from B02).
- Switch: Vuesax pill with smooth knob transition; optional on/off icons.

### VdSlider
- Track + thumb, `min/max/step`, `range` (two thumbs), tooltip on drag, `color`,
  ticks, keyboard support, RTL aware.

### VdInputNumber
- Numeric `VdInput` + increment/decrement buttons (Feather `plus`/`minus`),
  min/max/step, hold-to-repeat.

### VdUpload
- Drag-and-drop zone + button, file list with progress (`VdProgress`), preview
  thumbnails, `accept`, `multiple`, remove. Emits selected files.

## Deliverables
- All controls above with shared `VdField`/validation, typed props, v-model.
- Example `.vue` files for docs (B09); unit tests incl. validation paths.

## Acceptance criteria
- `v-model` two-way works for every control; `VdForm.validate()` aggregates
  field validity.
- VdInput floating-label + focus animation visually matches Vuesax.
- Select supports multiple + search + keyboard; chips render and are removable.
- a11y: labels associated, roles/aria for radio/checkbox/switch/slider, focus rings.

## Risks
- Overlay positioning for Select depends on Batch 07's menu primitive — sequence
  Select after `VdMenu`, or stub a minimal positioner and swap later.
- Validation API surface is easy to over-design; keep it to rules + messages + form
  context (Vuetify-style) and document.
