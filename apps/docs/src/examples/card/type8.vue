<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <vd-card type="8" style="max-width: 300px">
    <template #title><h3>Catch me</h3></template>
    <template #img><img :src="img('foto6.png')" alt="" /></template>
    <template #text>
      <p>Move your cursor closer — the card kinetically dodges away.</p>
    </template>
  </vd-card>
</template>
