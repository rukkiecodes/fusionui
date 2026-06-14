<script setup>
import { ref } from 'vue'
const a = ref('on')
const b = ref('on')
const c = ref('on')
const d = ref('on')
const e = ref('on')
</script>

<template>
  <div class="row">
    <f-radio v-model="a" value="on" color="primary">Primary</f-radio>
    <f-radio v-model="b" value="on" color="success">Success</f-radio>
    <f-radio v-model="c" value="on" color="danger">Danger</f-radio>
    <f-radio v-model="d" value="on" color="warning">Warning</f-radio>
    <f-radio v-model="e" value="on" color="#7d33ff">#7d33ff</f-radio>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
