<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
const positions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]
function open(position) {
  notify({ title: position, text: 'Positioned notification.', color: 'primary', position })
}
</script>

<template>
  <div class="grid">
    <f-btn v-for="p in positions" :key="p" variant="flat" color="primary" @click="open(p)">{{
      p
    }}</f-btn>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 480px;
}
</style>
