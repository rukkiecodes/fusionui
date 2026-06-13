<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <f-card type="5" style="max-width: 320px">
    <template #title><h3>Sand to today's time</h3></template>
    <template #img><img :src="img('foto13.png')" alt="" /></template>
    <template #text>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
    </template>
    <template #interactions>
      <f-btn icon="heart" color="danger" />
      <f-btn color="primary" prepend-icon="message-circle">54</f-btn>
    </template>
  </f-card>
</template>
