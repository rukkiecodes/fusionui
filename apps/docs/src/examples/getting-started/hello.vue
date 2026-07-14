<script setup>
import { ref } from 'vue'

const clicks = ref(0)
</script>

<template>
  <!-- No imports, no local registration: the plugin registered <f-btn> globally. -->
  <div class="d-flex align-center" style="gap: 12px; flex-wrap: wrap">
    <f-btn color="primary" prepend-icon="check" @click="clicks++">Click me</f-btn>

    <span class="count"> {{ clicks }} {{ clicks === 1 ? 'click' : 'clicks' }} </span>
  </div>
</template>

<style scoped>
.count {
  opacity: 0.7;
}
</style>
