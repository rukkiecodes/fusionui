<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <f-collapse v-model="open" title="What happens when my trial ends?">
    <p>
      Nothing is deleted. Your workspace switches to read-only until you pick a plan, and everything
      comes straight back once you do.
    </p>
  </f-collapse>
</template>
