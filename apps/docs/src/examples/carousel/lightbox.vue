<script setup>
const images = [
  'https://picsum.photos/seed/fusionui-lb1/1200/700',
  'https://picsum.photos/seed/fusionui-lb2/1200/700',
  'https://picsum.photos/seed/fusionui-lb3/1200/700',
  'https://picsum.photos/seed/fusionui-lb4/1200/700',
]
</script>

<template>
  <div class="demo">
    <!-- Click an image (or the expand button) to open the fullscreen lightbox. -->
    <f-carousel :items="images" lightbox counter aspect-ratio="16/9" />
  </div>
</template>

<style scoped>
.demo {
  max-width: 600px;
  margin: 0 auto;
}
</style>
