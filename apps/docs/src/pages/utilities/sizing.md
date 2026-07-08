# Sizing

Set width and height as a fraction of the parent with `w-*` and `h-*`.

## Width

`w-25`, `w-33`, `w-50`, `w-66`, `w-75`, `w-100`, and `w-auto`.

<div class="u-demo">
  <div class="u-block w-25 mb-2" style="height: 28px"></div>
  <div class="u-block w-50 mb-2" style="height: 28px"></div>
  <div class="u-block w-75 mb-2" style="height: 28px"></div>
  <div class="u-block w-100" style="height: 28px"></div>
</div>

```html
<div class="w-50">half width</div>
<div class="w-100">full width</div>
```

## Height

`h-25`, `h-50`, `h-75`, `h-100`, `h-auto`, and `h-screen` (100dvh). `fill-height`
is shorthand for `height: 100%`.

<div class="u-demo d-flex ga-3 align-end" style="height: 120px">
  <div class="u-block w-25 h-25 d-flex align-center justify-center" style="color:#fff;font-size:12px">h-25</div>
  <div class="u-block w-25 h-50 d-flex align-center justify-center" style="color:#fff;font-size:12px">h-50</div>
  <div class="u-block w-25 h-75 d-flex align-center justify-center" style="color:#fff;font-size:12px">h-75</div>
  <div class="u-block w-25 h-100 d-flex align-center justify-center" style="color:#fff;font-size:12px">h-100</div>
</div>

```html
<div style="height: 200px">
  <div class="h-50">half the container</div>
</div>
```

## Responsive

`w-*` and `h-*` take a breakpoint infix — `w-100 w-md-50` is full width on
phones and half from `md` up.

## Reference

| Class                                                     | Value                                  |
| --------------------------------------------------------- | -------------------------------------- |
| `w-auto` `w-0` `w-25` `w-33` `w-50` `w-66` `w-75` `w-100` | width: auto / 0 / 25% … 100%           |
| `h-auto` `h-screen` `h-0` `h-25` `h-50` `h-75` `h-100`    | height: auto / 100dvh / 0 / 25% … 100% |
| `fill-height`                                             | height: 100%                           |

`w-*` and `h-*` also take `-sm`/`-md`/`-lg`/`-xl`/`-xxl`.
