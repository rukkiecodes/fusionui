<script setup lang="ts">
import { ref } from 'vue'

const runs = ref([
  'Deploy #482 — succeeded',
  'Deploy #481 — succeeded',
  'Deploy #480 — failed',
  'Deploy #479 — succeeded',
  'Deploy #478 — cancelled',
  'Deploy #477 — succeeded',
  'Deploy #476 — succeeded',
  'Deploy #475 — succeeded',
])
let next = 483

// The gesture hands you `done` — call it when the request settles, whether it
// succeeded or not, or the spinner never stops.
function onLoad({ done }: { done: () => void }): void {
  setTimeout(() => {
    runs.value.unshift(`Deploy #${next++} — succeeded`)
    done()
  }, 1200)
}
</script>

<template>
  <div class="scroller">
    <f-pull-to-refresh @load="onLoad">
      <ul class="feed">
        <li v-for="run in runs" :key="run" class="feed__row">{{ run }}</li>
      </ul>
    </f-pull-to-refresh>
  </div>
</template>

<style scoped>
.scroller {
  width: 100%;
  max-width: 360px;
  height: 240px;
  margin: 0 auto;
  overflow-y: auto;
  border-radius: var(--fui-radius-lg);
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
}
.feed {
  margin: 0;
  padding: 0;
  list-style: none;
}
.feed__row {
  padding: 14px 16px;
  font-size: 0.88rem;
  border-bottom: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
}
</style>
