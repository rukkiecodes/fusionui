<script setup lang="ts">
import { ref } from 'vue'

const price = ref([20, 80])
</script>

<template>
  <div class="wrap">
    <div class="label">
      <span>Price range</span>
      <strong>${{ price[0] }} – ${{ price[1] }}</strong>
    </div>
    <f-range-slider v-model="price" />
  </div>
</template>

<style scoped>
.wrap {
  width: 100%;
  max-width: 420px;
}
.label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 4px;
}
</style>
