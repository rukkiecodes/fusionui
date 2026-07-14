<script setup>
import { ref } from 'vue'

const size = ref('default')
const sizes = ['small', 'default', 'large']
const rating = ref(3)
</script>

<template>
  <div class="wrap">
    <f-btn-group v-model="size">
      <f-btn v-for="s in sizes" :key="s" :value="s" variant="text" size="small">{{ s }}</f-btn>
    </f-btn-group>

    <div class="row">
      <f-btn :size="size" color="primary">FBtn</f-btn>
      <f-icon-btn :size="size" color="primary" icon="settings" aria-label="Settings" />
      <f-chip :size="size" color="success">FChip</f-chip>
      <f-kbd :size="size">⌘ K</f-kbd>
      <f-rating v-model="rating" :size="size" aria-label="Rate this" />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
