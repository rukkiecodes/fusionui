<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <f-card type="4">
    <template #title><h3>Art paintings</h3></template>
    <template #img><img :src="img('foto2.jpg')" alt="" /></template>
    <template #text>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
    </template>
    <template #interactions>
      <f-btn icon="heart" color="danger" />
      <f-btn color="primary" prepend-icon="message-circle">54</f-btn>
    </template>
  </f-card>
</template>
