<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const sort = ref('recent')
</script>

<template>
  <f-btn variant="tonal" prepend-icon="filter" @click="open = true">Sort orders</f-btn>

  <f-bottom-sheet v-model="open" inset>
    <h4 class="sheet__title">Sort by</h4>

    <f-radio-group v-model="sort">
      <f-radio value="recent">Most recent</f-radio>
      <f-radio value="total">Order total</f-radio>
      <f-radio value="status">Status</f-radio>
    </f-radio-group>

    <f-btn block color="primary" class="sheet__apply" @click="open = false">Apply</f-btn>
  </f-bottom-sheet>
</template>

<style scoped>
.sheet__title {
  margin: 0 0 12px;
  font-size: 1.05rem;
  font-weight: 600;
}
.sheet__apply {
  margin-top: 18px;
}
</style>
