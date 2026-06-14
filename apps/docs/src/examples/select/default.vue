<script setup>
import { ref } from 'vue'
const value = ref(null)
const items = ['Vue', 'React', 'Svelte', 'Angular', 'Solid']
</script>

<template>
  <div class="w">
    <f-select v-model="value" :items="items" label="Framework" placeholder="Pick one" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
}
</style>
