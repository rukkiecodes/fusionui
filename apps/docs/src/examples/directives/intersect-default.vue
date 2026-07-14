<script setup>
import { ref } from 'vue'

const cards = ['Design', 'Build', 'Ship']
const seen = ref([])
const replayKey = ref(0)

// `.once` disconnects the observer the first time the element intersects, so a
// reveal animation never re-runs when the reader scrolls back up.
function onReveal(index) {
  return isIntersecting => {
    if (isIntersecting && !seen.value.includes(index)) seen.value = [...seen.value, index]
  }
}

function replay() {
  seen.value = []
  replayKey.value++
}

// The object form takes IntersectionObserver options. The handler receives the
// same three arguments either way: (isIntersecting, entries, observer).
const ratio = ref(0)
const watching = {
  handler: (isIntersecting, entries) => {
    ratio.value = Math.round((entries[0]?.intersectionRatio ?? 0) * 100)
  },
  options: { threshold: [0, 0.25, 0.5, 0.75, 1] },
}
</script>

<template>
  <div class="wrap">
    <div :key="replayKey" class="cards">
      <div
        v-for="(card, i) in cards"
        :key="card"
        v-intersect.once="onReveal(i)"
        class="card"
        :class="{ 'card--in': seen.includes(i) }"
      >
        {{ card }}
      </div>
    </div>

    <div v-intersect="watching" class="meter">
      <span
        >This box is <strong>{{ ratio }}%</strong> visible in the viewport.</span
      >
      <span class="hint">Scroll the page — the handler fires at each threshold.</span>
    </div>

    <f-btn size="small" variant="outlined" @click="replay">Replay reveal</f-btn>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}
.card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 84px;
  border-radius: var(--fui-radius-md);
  background: rgba(var(--fui-theme-primary), 0.12);
  color: rgb(var(--fui-theme-primary));
  font-weight: 600;
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.card--in {
  opacity: 1;
  transform: none;
}
.meter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
  border-radius: var(--fui-radius-md);
  border: thin dashed rgba(var(--fui-theme-on-background), 0.2);
  font-size: 0.9rem;
}
.hint {
  font-size: 0.78rem;
  opacity: 0.6;
}
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}
</style>
