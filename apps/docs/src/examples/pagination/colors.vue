<script setup lang="ts">
import { ref } from 'vue'

const page = ref(2)
</script>

<template>
  <div class="col">
    <f-pagination v-model="page" :length="6" color="primary" />
    <f-pagination v-model="page" :length="6" color="success" />
    <f-pagination v-model="page" :length="6" color="danger" />
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
