---
'@rukkiecodes/native': minor
---

Add the Checkbox component — mirrors the web FCheckbox. The box fills with the
accent colour while the check mark draws itself on (an animated SVG dash offset,
no Skia, so it runs in Expo Go), plus an indeterminate dash for partial groups, a
custom icon slot in place of the tick, line-through labels, a loading ring, three
sizes, and array models so several boxes can share one selection. Honours
`reduceMotion` and reports `accessibilityRole="checkbox"` with a `mixed` state
when indeterminate.

Also fixes a type-only import in the Select's `const.ts`, which referenced a
non-existent `InputState` instead of `SelectState` and broke `tsc` for anyone who
copied the component in.
