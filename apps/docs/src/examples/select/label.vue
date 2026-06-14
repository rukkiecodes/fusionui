<script setup>
import { ref } from 'vue'
const value = ref(null)
const items = ['Low', 'Medium', 'High', 'Critical']
</script>

<template>
  <div class="w">
    <f-select v-model="value" :items="items" label-placeholder label="Priority" />
    <p class="hint">The label floats up when a value is selected.</p>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
}
.hint {
  margin: 10px 0 0;
  font-size: 0.82rem;
  opacity: 0.6;
  text-align: center;
}
</style>
