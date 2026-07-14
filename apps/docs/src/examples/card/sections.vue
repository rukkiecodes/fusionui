<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <f-card style="max-width: 320px">
    <template #img><img :src="img('foto5.png')" alt="" /></template>

    <f-card-title><h3>Trendy clothing</h3></f-card-title>
    <f-card-text>
      <p>Our spring drop — organic cotton, cut in Porto, shipped carbon-neutral.</p>
    </f-card-text>
    <f-card-buttons>
      <f-btn color="primary">Add to bag</f-btn>
      <f-btn variant="text">Details</f-btn>
    </f-card-buttons>
  </f-card>
</template>
