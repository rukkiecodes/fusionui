<script setup lang="ts">
import { ref } from 'vue'

const hour = ref('12:00')

const hours = Array.from({ length: 14 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)
</script>

<template>
  <f-slide-group v-model="hour" mandatory center-active show-arrows="always" class="rail">
    <f-slide-group-item v-for="time in hours" :key="time" :value="time" :text="time" />
  </f-slide-group>
</template>

<style scoped>
.rail {
  width: 100%;
  min-width: 0;
}
</style>
