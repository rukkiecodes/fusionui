<script setup>
// Orders per day for the last two weeks.
const orders = [12, 18, 9, 24, 31, 27, 14, 8, 19, 26, 33, 29, 22, 17]
// Net cash movement — bars are read against zero, so negatives dip below it.
const cashflow = [4200, -1800, 2600, 900, -3400, 5100, 2200, -600, 3800]
</script>

<template>
  <div class="stack">
    <f-sparkline
      type="bar"
      :model-value="orders"
      color="primary"
      :line-width="10"
      smooth
      :height="70"
      aria-label="Orders per day for the last two weeks"
    />

    <f-sparkline
      type="bar"
      :model-value="cashflow"
      color="warning"
      :line-width="14"
      :height="70"
      aria-label="Daily net cash movement"
    />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
</style>
