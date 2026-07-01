<script setup>
const images = [
  'https://picsum.photos/seed/fusionui-cy1/1200/700',
  'https://picsum.photos/seed/fusionui-cy2/1200/700',
  'https://picsum.photos/seed/fusionui-cy3/1200/700',
]
</script>

<template>
  <div class="demo">
    <!-- Auto-advances every 2.5s; pauses on hover. -->
    <f-carousel :items="images" cycle :interval="2500" aspect-ratio="16/9" />
  </div>
</template>

<style scoped>
.demo {
  max-width: 600px;
  margin: 0 auto;
}
</style>
