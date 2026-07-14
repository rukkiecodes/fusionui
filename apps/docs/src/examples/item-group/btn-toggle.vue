<script setup lang="ts">
import { ref } from 'vue'

const align = ref('left')
</script>

<template>
  <div class="stack">
    <f-btn-toggle v-model="align" mandatory>
      <f-btn value="left" icon="align-left" />
      <f-btn value="center" icon="align-center" />
      <f-btn value="right" icon="align-right" />
      <f-btn value="justify" icon="align-justify" />
    </f-btn-toggle>

    <p class="state">text-align: {{ align }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.state {
  margin: 0;
  font-family: var(--fui-font-family-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
}
</style>
