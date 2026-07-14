<script setup lang="ts">
import { ref } from 'vue'

const files = ref<File[]>([])
</script>

<template>
  <f-upload v-model="files" />
</template>
