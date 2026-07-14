<script setup>
const revenue = [3200, 4100, 3800, 5200, 4900, 6100, 5800, 7200, 6900, 8100, 7600, 8800]
</script>

<template>
  <div class="stack">
    <!-- `fill` alone paints the area under the line in the current color. -->
    <f-sparkline
      fill
      smooth
      :model-value="revenue"
      color="primary"
      :height="80"
      aria-label="Monthly revenue, filled"
    />

    <!-- Gradient stops run from the far end of `gradient-direction` back. -->
    <f-sparkline
      fill
      smooth
      :model-value="revenue"
      :gradient="['#8b5cf6', '#38bdf8', 'transparent']"
      gradient-direction="top"
      :height="80"
      aria-label="Monthly revenue, gradient fill"
    />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}
</style>
