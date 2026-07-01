<script setup>
const ratios = [
  { ratio: '1/1', seed: 'sq' },
  { ratio: '4/3', seed: 'std' },
  { ratio: '16/9', seed: 'wide' },
]
</script>

<template>
  <div class="grid">
    <figure v-for="r in ratios" :key="r.ratio">
      <f-image
        :src="`https://picsum.photos/seed/fusionui-${r.seed}/800/800`"
        :aspect-ratio="r.ratio"
        cover
        rounded
      />
      <figcaption>
        <code>{{ r.ratio }}</code>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
