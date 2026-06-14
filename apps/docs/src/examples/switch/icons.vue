<script setup>
import { ref } from 'vue'
const sound = ref(true)
const ok = ref(true)
const theme = ref(false)
const fav = ref(true)
</script>

<template>
  <div class="row">
    <f-switch v-model="sound">
      <template #on><f-icon icon="volume-2" :size="13" /></template>
      <template #off><f-icon icon="volume-x" :size="13" /></template>
    </f-switch>

    <f-switch v-model="ok" color="success">
      <template #on><f-icon icon="check" :size="13" /></template>
      <template #off><f-icon icon="x" :size="13" /></template>
    </f-switch>

    <f-switch v-model="theme" color="dark">
      <template #circle><f-icon :icon="theme ? 'sun' : 'moon'" :size="13" /></template>
    </f-switch>

    <f-switch v-model="fav" icon color="#7d33ff">
      <template #circle><f-icon icon="heart" :size="14" /></template>
    </f-switch>
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
