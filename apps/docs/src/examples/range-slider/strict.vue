<script setup lang="ts">
import { ref } from 'vue'

const loose = ref([40, 60])
const strict = ref([40, 60])
</script>

<template>
  <div class="stack">
    <div>
      <div class="label">Default — the thumbs may meet ({{ loose[0] }} – {{ loose[1] }})</div>
      <f-range-slider v-model="loose" :step="5" />
    </div>

    <div>
      <div class="label">
        <code>strict</code> — always at least one step apart ({{ strict[0] }} – {{ strict[1] }})
      </div>
      <f-range-slider v-model="strict" :step="5" strict />
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 420px;
}
.label {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 4px;
}
</style>
