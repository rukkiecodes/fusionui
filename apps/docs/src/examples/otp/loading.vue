<script setup>
import { ref } from 'vue'
const code = ref('1234')
const loading = ref(true)
</script>

<template>
  <div class="col">
    <f-otp v-model="code" :length="4" :loading="loading" />
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
