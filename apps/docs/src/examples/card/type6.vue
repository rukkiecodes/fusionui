<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <vd-card type="6" style="max-width: 340px">
    <template #title><h3>Mountain escape</h3></template>
    <template #img><img :src="img('foto2.jpg')" alt="" /></template>
    <template #text>
      <p>Scroll the page — the image drifts inside its frame.</p>
    </template>
    <template #interactions>
      <vd-btn icon="heart" color="danger" />
      <vd-btn color="primary" prepend-icon="message-circle">54</vd-btn>
    </template>
  </vd-card>
</template>
