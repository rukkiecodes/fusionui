<script setup lang="ts">
import { ref } from 'vue'

const page = ref(3)
const loading = ref(true)
</script>

<template>
  <div class="col">
    <f-pagination v-model="page" :length="8" :disabled="loading" />
    <f-btn variant="tonal" @click="loading = !loading">
      {{ loading ? 'Finish loading' : 'Simulate loading' }}
    </f-btn>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
</style>
