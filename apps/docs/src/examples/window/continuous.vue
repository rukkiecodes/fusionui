<script setup lang="ts">
import { ref } from 'vue'

const photo = ref(0)

const photos = [
  'https://picsum.photos/seed/fusionui-w1/900/500',
  'https://picsum.photos/seed/fusionui-w2/900/500',
  'https://picsum.photos/seed/fusionui-w3/900/500',
]
</script>

<template>
  <f-window v-model="photo" continuous show-arrows="hover" class="frame">
    <f-window-item v-for="(src, i) in photos" :key="src" :value="i">
      <img :src="src" alt="" />
    </f-window-item>
  </f-window>
</template>

<style scoped>
.frame {
  width: 100%;
  max-width: 520px;
  border-radius: 14px;
  overflow: hidden;
}

img {
  display: block;
  width: 100%;
  height: 280px;
  object-fit: cover;
}
</style>
