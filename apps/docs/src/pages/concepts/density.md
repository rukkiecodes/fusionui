# Size & Density

Two separate scales. **Size** changes how big a component is — its type scale,
its padding, its radius. **Density** changes how much air sits _between_ things
without changing their size. They are independent props, defined in
`makeSizeProps` and `makeDensityProps`, and a component opts into either, both
or neither.

## The size scale

`size` accepts six tokens: `x-small`, `small`, `default`, `medium`, `large`,
`x-large`. A token becomes a modifier class on the component's own block
(`fui-btn--size-large`), and the component's stylesheet decides what that step
means for it — padding and radius scale together with the type, so a small
button stays a button rather than a shrunken one.

<Example file="concepts/size-scale" />

`FBtn`, `FIconBtn`, `FChip`, `FFab`, `FKbd`, `FCode` and `FRating` take the
scale. Only the steps a component actually styles do anything: `default` is the
base, `FChip` distinguishes just `small` and `large`, and no component currently
draws a distinct `medium` step — it renders at the default size.

<Example file="concepts/size-across" />

## Pixel sizes

Components whose whole job is a box — `FAvatar`, `FIcon`, `FTimelineItem`'s dot,
`FProgressCircular` — resolve their own dimension, so `size` there also takes a
number (or any CSS length) and maps its named tokens to real values:

| Component    | `x-small` | `small` | `default` | `medium` | `large` | `x-large` |
| ------------ | --------- | ------- | --------- | -------- | ------- | --------- |
| `FIcon`      | 12px      | 16px    | 24px      | 28px     | 36px    | 48px      |
| `FAvatar`    | 28px      | 34px    | 44px      | —        | 56px    | 72px      |
| Timeline dot | 20px      | 28px    | 38px      | 44px     | 52px    | 64px      |

<Example file="concepts/size-pixel" />

Buttons and chips are the other way round: they only understand the named
tokens. Pass `size="48"` to an `FBtn` and nothing happens — resize it with the
scale, or with your own class.

## Density

`density` takes `default`, `comfortable` or `compact` and, like the variant
prop, validates against that list. It never touches a component's size — it
tightens the space the component distributes.

Two components read it today. `FRow` maps it to the grid gutter (24px / 16px /
8px, straight from the spacing tokens):

<Example file="grid/gutters" />

`FTimeline` maps it to the dot size and the gap between items, and switches the
default side from `alternate` to `end` at any non-default density, because
alternating items stop reading as a single column once they are packed
together:

<Example file="timeline/density" />

## Setting a default

Size and density are ordinary props, so the defaults system covers them. To make
a whole app — or one dialog — compact:

```ts
createFusionUI({
  defaults: {
    global: { size: 'small' },
    FRow: { density: 'compact' },
  },
})
```

```html
<f-defaults-provider :defaults="{ global: { size: 'small' } }">
  <!-- everything in this subtree renders one step down -->
</f-defaults-provider>
```

`global` applies to every component that declares the prop; a per-component key
beats it. See [Theme & Defaults](/components/providers).
