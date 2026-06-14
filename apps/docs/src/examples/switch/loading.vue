<script setup>
import { ref } from 'vue'
const on = ref(true)
const loading = ref(true)
</script>

<template>
  <div class="col">
    <f-switch v-model="on" :loading="loading" color="primary" />
    <f-btn size="small" variant="tonal" @click="loading = !loading">
      {{ loading ? 'Stop' : 'Start' }} loading
    </f-btn>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
</style>
