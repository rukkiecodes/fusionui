<script setup>
const images = [
  'https://picsum.photos/seed/fusionui-t1/1200/700',
  'https://picsum.photos/seed/fusionui-t2/1200/700',
  'https://picsum.photos/seed/fusionui-t3/1200/700',
  'https://picsum.photos/seed/fusionui-t4/1200/700',
  'https://picsum.photos/seed/fusionui-t5/1200/700',
]
</script>

<template>
  <div class="demo">
    <!-- A thumbnail strip + a "3 / 5" counter — ideal for galleries. -->
    <f-carousel :items="images" thumbnails counter aspect-ratio="16/10" />
  </div>
</template>

<style scoped>
.demo {
  max-width: 600px;
  margin: 0 auto;
}
</style>
