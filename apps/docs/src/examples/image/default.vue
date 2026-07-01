<script setup>
const src = 'https://picsum.photos/seed/fusionui-lake/1200/750'
// A tiny version acts as the blur-up placeholder while the full image loads.
const lazy = 'https://picsum.photos/seed/fusionui-lake/16/10'
</script>

<template>
  <div class="demo">
    <f-image :src="src" :lazy-src="lazy" alt="Scenery" aspect-ratio="16/10" cover rounded />
  </div>
</template>

<style scoped>
.demo {
  max-width: 520px;
  margin: 0 auto;
}
</style>
