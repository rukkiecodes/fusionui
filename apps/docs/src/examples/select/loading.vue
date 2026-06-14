<script setup>
import { ref } from 'vue'
const value = ref(null)
const loading = ref(true)
const items = ['Option A', 'Option B', 'Option C']
</script>

<template>
  <div class="w">
    <f-select v-model="value" :items="items" :loading="loading" label="Async data" />
    <f-btn size="small" variant="tonal" @click="loading = !loading">
      {{ loading ? 'Stop' : 'Start' }} loading
    </f-btn>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
</style>
