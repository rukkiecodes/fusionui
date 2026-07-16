# Component parity

Native components mirror their web siblings' contracts — the same prop names,
variants and states — so a screen reads the same on both platforms. Parity is not
shared _source_ (you can't run a Vue component inside React Native); it is a shared
_contract_, enforced by tests.

| Web (`@rukkiecodes/vue`) | Native (`@rukkiecodes/native`) | Shared contract                                                     |
| ------------------------ | ------------------------------ | ------------------------------------------------------------------- |
| `<f-btn>`                | `<FButton>`                    | `variant`, `color`, `size`, `loading`, `disabled`, `block`          |
| `<f-card>`               | `<FCard>`                      | `flat`, `padding`, `radius`                                         |
| `<f-input>`              | `<FInput>`                     | `label`, `value`, `disabled`, `error`, `message`                    |
| `<f-switch>`             | `<FSwitch>`                    | `value`, `color`, `disabled`                                        |
| `<f-checkbox>`           | `<FCheckbox>`                  | `value`, `color`, `disabled`, `label`                               |
| `<f-radio-group>`        | `<FRadioGroup>`                | `value`, `options`, `color`, `disabled`                             |
| `<f-chip>`               | `<FChip>`                      | `variant`, `color`, `size`                                          |
| `<f-badge>`              | `<FBadge>`                     | `content`, `color`, `dot`, `max`                                    |
| `<f-avatar>`             | `<FAvatar>`                    | `image`, `text`, `color`, `size`, `circle`                          |
| `<f-progress>`           | `<FProgress>`                  | `value`, `max`, `color`, `height`                                   |
| `<f-divider>`            | `<FDivider>`                   | `vertical`, `inset`                                                 |
| `<f-alert>`              | `<FAlert>`                     | `variant`, `color`, `type`, `title`, `text`, `closable`             |
| `<f-glass>`              | `<LiquidGlassView>`            | `radius`, glass `options` — same SDF→Snell engine                   |
| navbar + sidebar shell   | `<FShell>`                     | the fluid goo junction, drawn with Skia from the same path commands |

Unit tests enforce that the native `FButton` and `FAlert` variant unions are
subsets of their web counterparts, so the platforms can't silently drift.

> Component coverage on native is a growing subset of the web set. Each shipped
> component has its own [page](/components) with a live Snack per variant.
