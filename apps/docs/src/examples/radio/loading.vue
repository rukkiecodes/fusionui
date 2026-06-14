<script setup>
import { ref } from 'vue'
const v = ref('a')
const loading = ref(true)
</script>

<template>
  <div class="col">
    <f-radio v-model="v" value="a" :loading="loading">Syncing preference…</f-radio>
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
