<script setup>
const images = [
  'https://picsum.photos/seed/fusionui-p1/1200/700',
  'https://picsum.photos/seed/fusionui-p2/1200/700',
  'https://picsum.photos/seed/fusionui-p3/1200/700',
  'https://picsum.photos/seed/fusionui-p4/1200/700',
]
</script>

<template>
  <div class="demo">
    <!-- A progress bar replaces the delimiters. -->
    <f-carousel :items="images" progress hide-delimiters aspect-ratio="16/9" />
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
