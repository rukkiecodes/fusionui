<script setup lang="ts">
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <div class="col">
    <f-pagination v-model="page" :length="5" />
    <span class="caption">Showing results for page {{ page }} of 5</span>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.caption {
  font-size: 0.85rem;
  opacity: 0.65;
}
</style>
