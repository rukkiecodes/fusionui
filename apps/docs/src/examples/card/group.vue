<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <f-card-group>
    <f-card v-for="n in 6" :key="n">
      <template #title><h3>Pot with a plant</h3></template>
      <template #img><img :src="img(`foto${n}.png`)" alt="" /></template>
      <template #text>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
      </template>
      <template #interactions>
        <f-btn icon="heart" color="danger" />
        <f-btn color="primary" prepend-icon="message-circle">54</f-btn>
      </template>
    </f-card>
  </f-card-group>
</template>
