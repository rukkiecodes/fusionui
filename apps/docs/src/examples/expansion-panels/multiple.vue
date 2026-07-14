<script setup lang="ts">
import { ref } from 'vue'

const open = ref(['build', 'deploy'])
</script>

<template>
  <div class="stack">
    <f-expansion-panels v-model="open" multiple>
      <f-expansion-panel value="install" title="Install" text="pnpm install --frozen-lockfile" />
      <f-expansion-panel value="build" title="Build" text="pnpm -r build" />
      <f-expansion-panel value="deploy" title="Deploy" text="pnpm deploy --env production" />
    </f-expansion-panels>

    <p class="state">Open: {{ open.join(', ') || 'none' }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.state {
  margin: 0;
  font-family: var(--fui-font-family-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
}
</style>
