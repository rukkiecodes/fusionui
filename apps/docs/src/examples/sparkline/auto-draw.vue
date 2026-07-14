<script setup>
import { ref } from 'vue'

function series() {
  let value = 40 + Math.random() * 20
  return Array.from({ length: 14 }, () => {
    value = Math.max(8, value + (Math.random() - 0.45) * 18)
    return Math.round(value)
  })
}

const signups = ref(series())
const deploys = ref(series())

// The series is drawn in again whenever the data changes.
function refresh() {
  signups.value = series()
  deploys.value = series()
}
</script>

<template>
  <div class="stack">
    <div class="actions">
      <f-btn size="small" color="primary" prepend-icon="refresh-cw" @click="refresh">
        New data
      </f-btn>
    </div>

    <div class="pane">
      <span class="pane__label">Trend — the stroke traces itself</span>
      <f-sparkline
        auto-draw
        smooth
        :model-value="signups"
        color="primary"
        :line-width="3"
        :height="60"
        :auto-draw-duration="1600"
        aria-label="Daily signups"
      />
    </div>

    <div class="pane">
      <span class="pane__label">Bars — the shape wipes up from the baseline</span>
      <f-sparkline
        auto-draw
        type="bar"
        :model-value="deploys"
        color="success"
        :line-width="10"
        smooth
        :height="60"
        :auto-draw-duration="700"
        aria-label="Daily deploys"
      />
    </div>

    <p class="note">Under <code>prefers-reduced-motion</code> both simply appear, finished.</p>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  align-items: stretch;
}

.actions {
  display: flex;
  justify-content: flex-start;
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

.note {
  margin: 0;
  font-size: 0.8125rem;
  opacity: 0.55;
  text-align: start;
}
</style>
