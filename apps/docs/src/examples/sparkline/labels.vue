<script setup>
// Items can be plain numbers, or `{ value, label }` when the label is not the value.
const quarters = [
  { value: 82000, label: 'Q1' },
  { value: 94500, label: 'Q2' },
  { value: 88000, label: 'Q3' },
  { value: 121000, label: 'Q4' },
]

const visits = [180, 240, 210, 320, 280, 360, 410]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<template>
  <div class="stack">
    <div class="pane">
      <span class="pane__label">Bar, labelled from the data</span>
      <f-sparkline
        show-labels
        type="bar"
        :model-value="quarters"
        color="primary"
        :line-width="24"
        :label-size="8"
        :height="80"
        aria-label="Revenue by quarter"
      />
    </div>

    <div class="pane">
      <span class="pane__label">Trend, labels rewritten by the slot</span>
      <f-sparkline
        show-labels
        smooth
        :model-value="visits"
        color="secondary"
        :line-width="3"
        :label-size="7"
        :height="70"
        :padding="14"
        aria-label="Visits per weekday"
      >
        <!-- The slot gets `{ index, value }` — here the weekday replaces the number. -->
        <template #label="{ index }">{{ days[index] }}</template>
      </f-sparkline>
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 460px;
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
