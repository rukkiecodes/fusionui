<script setup>
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <f-alert v-model:page="page" color="primary" style="max-width: 560px">
    <template #title>Paginated content</template>
    <template #page-1>
      Page 1 — each page is its own slot, and you can add as many pages as you need.
    </template>
    <template #page-2>
      Page 2 — put text, HTML, or components inside; the height animates between pages.
    </template>
    <template #page-3> Page 3 — the last page of this example. </template>
  </f-alert>
</template>
