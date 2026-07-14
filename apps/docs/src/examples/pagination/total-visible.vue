<script setup lang="ts">
import { ref } from 'vue'

const page = ref(8)
</script>

<template>
  <div class="col">
    <f-pagination v-model="page" :length="24" />
    <f-pagination v-model="page" :length="24" :total-visible="5" />
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
