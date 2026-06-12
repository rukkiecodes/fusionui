<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <vd-card-group>
    <vd-card v-for="n in 6" :key="n">
      <template #title><h3>Pot with a plant</h3></template>
      <template #img><img :src="img(`foto${n}.png`)" alt="" /></template>
      <template #text>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
      </template>
      <template #interactions>
        <vd-btn icon="heart" color="danger" />
        <vd-btn color="primary" variant="shadow" prepend-icon="message-circle">54</vd-btn>
      </template>
    </vd-card>
  </vd-card-group>
</template>
