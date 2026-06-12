<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <vd-card type="10">
    <template #front>
      <img :src="img('foto5.png')" alt="" />
    </template>
    <template #back>
      <h3>Trendy clothing</h3>
      <p>Premium cotton, ethically made. Move your cursor away to flip back.</p>
      <vd-btn color="primary" size="small">Shop now</vd-btn>
    </template>
  </vd-card>
</template>
