<script setup>
const images = [
  'https://picsum.photos/seed/fusionui-c1/1200/700',
  'https://picsum.photos/seed/fusionui-c2/1200/700',
  'https://picsum.photos/seed/fusionui-c3/1200/700',
  'https://picsum.photos/seed/fusionui-c4/1200/700',
]
</script>

<template>
  <div class="demo">
    <f-carousel :items="images" aspect-ratio="16/9" />
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
