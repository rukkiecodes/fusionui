<script setup>
import { ref } from 'vue'
const a = ref(true)
const b = ref(false)
const c = ref(true)
</script>

<template>
  <div class="col">
    <f-checkbox v-model="a" line-through color="success">Buy groceries</f-checkbox>
    <f-checkbox v-model="b" line-through color="success">Walk the dog</f-checkbox>
    <f-checkbox v-model="c" line-through color="success">Water the plants</f-checkbox>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
