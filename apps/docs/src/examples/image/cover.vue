<script setup>
const src = 'https://picsum.photos/seed/fusionui-city/700/700'
</script>

<template>
  <div class="grid">
    <figure>
      <f-image :src="src" cover height="180" rounded />
      <figcaption><code>cover</code></figcaption>
    </figure>
    <figure>
      <f-image :src="src" height="180" rounded />
      <figcaption><code>contain</code> (default)</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
figure {
  margin: 0;
}
figcaption {
  margin-top: 8px;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.75;
}
</style>
