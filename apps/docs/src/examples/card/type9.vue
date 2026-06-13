<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <f-card type="9" style="max-width: 300px">
    <template #title><h3>Follow me</h3></template>
    <template #img><img :src="img('foto1.png')" alt="" /></template>
    <template #text>
      <p>Hover around — the card leans and tilts toward your cursor.</p>
    </template>
  </f-card>
</template>
