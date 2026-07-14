<script setup lang="ts">
import { ref } from 'vue'

const volume = ref(40)
</script>

<template>
  <div class="w">
    <label class="label"
      >Volume <span>{{ volume }}%</span></label
    >
    <f-slider v-model="volume" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}
.label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
