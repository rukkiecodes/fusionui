<script setup lang="ts">
import { ref } from 'vue'

const photos = ref<File[]>([])
</script>

<template>
  <f-upload
    v-model="photos"
    multiple
    accept="image/png, image/jpeg"
    text="Add product photos — PNG or JPEG, up to 5 MB each"
  />
</template>
