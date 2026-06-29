<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
const colors = ['primary', 'success', 'danger', 'warning', 'secondary']
function open(color) {
  notify({ title: color, text: `A ${color} notification.`, color, position: 'bottom-right' })
}
</script>

<template>
  <div class="row">
    <f-btn v-for="c in colors" :key="c" :color="c" @click="open(c)">{{ c }}</f-btn>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
