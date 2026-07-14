<script setup>
const images = [
  'https://picsum.photos/seed/fusionui-a1/1200/700',
  'https://picsum.photos/seed/fusionui-a2/1200/700',
  'https://picsum.photos/seed/fusionui-a3/1200/700',
]
</script>

<template>
  <div class="demo">
    <!-- Arrows appear only on hover; the dot delimiters are hidden. -->
    <f-carousel :items="images" show-arrows="hover" hide-delimiters aspect-ratio="16/9" />
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
