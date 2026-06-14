<script setup>
import { ref } from 'vue'
const a = ref(true)
const b = ref(false)
</script>

<template>
  <div class="row">
    <f-switch v-model="a">
      <template #on>ON</template>
      <template #off>OFF</template>
    </f-switch>
    <f-switch v-model="b" color="success">
      <template #on>Premium</template>
      <template #off>Free</template>
    </f-switch>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}
</style>
