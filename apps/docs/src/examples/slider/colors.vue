<script setup lang="ts">
import { ref } from 'vue'

const brightness = ref(70)
const contrast = ref(45)
const saturation = ref(25)
</script>

<template>
  <div class="w">
    <f-slider v-model="brightness" color="primary" />
    <f-slider v-model="contrast" color="success" />
    <f-slider v-model="saturation" color="danger" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}
</style>
