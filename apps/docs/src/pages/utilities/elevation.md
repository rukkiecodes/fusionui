# Elevation

Cast a shadow to lift an element off the surface. `elevation-0` through
`elevation-24` map to the shadow tokens — higher numbers sit further above the
page.

<div class="u-demo d-flex ga-6 flex-wrap align-center" style="padding: 32px">
  <span class="elevation-1 d-flex align-center justify-center" style="width:72px;height:72px;border-radius:12px;background:rgb(var(--fui-theme-surface));font-size:12px">1</span>
  <span class="elevation-4 d-flex align-center justify-center" style="width:72px;height:72px;border-radius:12px;background:rgb(var(--fui-theme-surface));font-size:12px">4</span>
  <span class="elevation-8 d-flex align-center justify-center" style="width:72px;height:72px;border-radius:12px;background:rgb(var(--fui-theme-surface));font-size:12px">8</span>
  <span class="elevation-16 d-flex align-center justify-center" style="width:72px;height:72px;border-radius:12px;background:rgb(var(--fui-theme-surface));font-size:12px">16</span>
  <span class="elevation-24 d-flex align-center justify-center" style="width:72px;height:72px;border-radius:12px;background:rgb(var(--fui-theme-surface));font-size:12px">24</span>
</div>

```html
<div class="elevation-4">a lifted card</div>
<div class="elevation-0">flat</div>
```

## Reference

`elevation-0` … `elevation-24` — box-shadow from the elevation token scale.
`elevation-0` removes the shadow.
