<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <f-card type="10">
    <template #front>
      <img :src="img('foto5.png')" alt="" />
    </template>
    <template #back>
      <h3>Trendy clothing</h3>
      <p>Premium cotton, ethically made. Move your cursor away to flip back.</p>
      <f-btn color="primary" size="small">Shop now</f-btn>
    </template>
  </f-card>
</template>
