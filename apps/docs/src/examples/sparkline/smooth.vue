<script setup>
const revenue = [3200, 4100, 3800, 5200, 4900, 6100, 5800, 7200, 6900, 8100]
</script>

<template>
  <div class="stack">
    <div class="pane">
      <span class="pane__label">Sharp — straight segments between points</span>
      <f-sparkline :model-value="revenue" color="primary" :line-width="3" :height="60" decorative />
    </div>

    <div class="pane">
      <span class="pane__label">Smooth — a monotone curve that never overshoots</span>
      <f-sparkline
        smooth
        :model-value="revenue"
        color="primary"
        :line-width="3"
        :height="60"
        aria-label="Monthly revenue"
      />
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}

.pane {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: start;
}

.pane__label {
  font-size: 0.8125rem;
  opacity: 0.65;
}
</style>
