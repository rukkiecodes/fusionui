<script setup lang="ts">
import { ref } from 'vue'

const marks = ref(['bold'])
const range = ref('7d')
</script>

<template>
  <div class="stack">
    <f-btn-toggle v-model="marks" multiple divided color="secondary">
      <f-btn value="bold" icon="bold" />
      <f-btn value="italic" icon="italic" />
      <f-btn value="underline" icon="underline" />
    </f-btn-toggle>

    <f-btn-toggle v-model="range" mandatory variant="outlined" rounded="pill">
      <f-btn value="24h">24h</f-btn>
      <f-btn value="7d">7 days</f-btn>
      <f-btn value="30d">30 days</f-btn>
    </f-btn-toggle>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
</style>
