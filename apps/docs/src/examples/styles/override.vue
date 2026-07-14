<template>
  <div class="override">
    <div class="row">
      <f-btn>default</f-btn>
      <f-btn class="squared">overridden</f-btn>
    </div>

    <div class="row brand-section">
      <f-btn>retinted</f-btn>
      <f-btn variant="tonal">retinted</f-btn>
      <f-btn variant="outlined">retinted</f-btn>
    </div>
  </div>
</template>

<style scoped>
.override {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* Unlayered: this single-class rule beats FBtn's own radius, tracking and
   font-size rules in the fui-components layer. No !important, no specificity
   escalation. */
.squared {
  border-radius: 4px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

/* The button's accent is `var(--fui-theme-primary)`, resolved where the button
   sits — so redefining the theme variable on an ancestor retints every variant
   at once. The value is an RGB triplet, not a color. */
.brand-section {
  --fui-theme-primary: 236, 72, 153;
  --fui-theme-on-primary: 255, 255, 255;
}
</style>
