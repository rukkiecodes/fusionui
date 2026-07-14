# Pull to refresh

`FPullToRefresh` wraps content in the mobile gesture: drag it down past a
threshold, release, and a refresh runs. It is strictly additive — on a device
without touch, or when the user prefers reduced motion, no gesture is wired up at
all and the component is a plain wrapper around its slot. Use a phone, or your
browser's device emulation, to try the examples below.

## Default

Listen to `@load`: it hands you a `done` callback. Call it when the request
settles — success or failure — or the indicator spins forever.

The gesture only starts when the nearest scroll container is already at the top,
so it never steals a normal scroll.

<Example file="pull-to-refresh/default" />

## Custom indicator

The `pullDown` slot replaces the arrow-and-spinner with your own cue. It receives
`canRefresh` (the threshold has been crossed — releasing now will refresh),
`refreshing`, and the current `distance` in pixels.

`pull-down-threshold` sets how far the content must travel, and `v-model` is the
other way to end a refresh: set it to `false` when the work is done.

<Example file="pull-to-refresh/custom" />

## Disabling

`disabled` turns the gesture off without unmounting the content — useful while a
list is already loading, or on a screen where a pull means something else.

```vue
<f-pull-to-refresh :disabled="editing" @load="refresh">…</f-pull-to-refresh>
```

## API

<ApiTable name="FPullToRefresh" />
