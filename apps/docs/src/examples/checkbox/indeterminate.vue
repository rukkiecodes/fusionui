<script setup>
import { ref, computed } from 'vue'

const items = ref([true, false, true])
const all = computed({
  get: () => items.value.every(Boolean),
  set: v => (items.value = items.value.map(() => v)),
})
const some = computed(() => items.value.some(Boolean) && !items.value.every(Boolean))
</script>

<template>
  <div class="col">
    <f-checkbox v-model="all" :indeterminate="some">Select all</f-checkbox>
    <div class="sub">
      <f-checkbox v-model="items[0]">Item one</f-checkbox>
      <f-checkbox v-model="items[1]">Item two</f-checkbox>
      <f-checkbox v-model="items[2]">Item three</f-checkbox>
    </div>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sub {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 26px;
}
</style>
