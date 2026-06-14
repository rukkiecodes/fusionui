<script setup>
import { ref } from 'vue'
const a = ref(false)
</script>

<template>
  <div class="col">
    <f-switch v-model="a" indeterminate />
    <p class="hint">An undetermined state — centered thumb, interaction disabled.</p>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.hint {
  margin: 0;
  font-size: 0.82rem;
  opacity: 0.6;
}
</style>
