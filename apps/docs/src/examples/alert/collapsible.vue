<script setup>
import { ref } from 'vue'
const hidden = ref(true)
</script>

<template>
  <f-alert v-model:hidden-content="hidden" color="primary" style="max-width: 560px">
    <template #title>Click the title to expand</template>
    The content collapses and expands when you click the title — handy for optional details you
    don't want to show by default.
  </f-alert>
</template>
