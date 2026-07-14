<script setup lang="ts">
import { ref } from 'vue'

const variant = ref('accordion')
</script>

<template>
  <div class="stack">
    <f-btn-toggle v-model="variant" mandatory divided variant="tonal">
      <f-btn value="default" size="small">default</f-btn>
      <f-btn value="accordion" size="small">accordion</f-btn>
      <f-btn value="inset" size="small">inset</f-btn>
      <f-btn value="popout" size="small">popout</f-btn>
    </f-btn-toggle>

    <f-expansion-panels :variant="variant">
      <f-expansion-panel
        title="Runtime"
        text="Node 22 on a shared instance, scaled to zero after 5 minutes idle."
      />
      <f-expansion-panel
        title="Environment variables"
        text="12 variables, 3 of them encrypted secrets."
      />
      <f-expansion-panel title="Domains" text="acme.dev and www.acme.dev, both verified." />
    </f-expansion-panels>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
