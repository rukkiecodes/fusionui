<script setup lang="ts">
import { ref } from 'vue'

const summary = ref('')
const notes = ref('Renewal call went well — they want SSO before signing.')
</script>

<template>
  <div class="stack">
    <f-textarea
      v-model="summary"
      label="Release notes"
      placeholder="What changed in this version?"
      :rows="5"
      hint="Markdown is supported. Shown to every user on upgrade."
      persistent-hint
    />

    <f-textarea v-model="notes" label="Account notes" color="success" :rows="3" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 480px;
}
</style>
