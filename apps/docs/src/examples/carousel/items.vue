<script setup>
const slides = [
  'https://picsum.photos/seed/fusionui-it1/1200/700',
  'https://picsum.photos/seed/fusionui-it2/1200/700',
  'https://picsum.photos/seed/fusionui-it3/1200/700',
]
</script>

<template>
  <div class="demo">
    <!-- Compose slides with FCarouselItem (like Vuetify's v-carousel-item). -->
    <f-carousel height="320">
      <f-carousel-item v-for="src in slides" :key="src" :src="src" cover />
      <f-carousel-item>
        <div class="custom">A fully custom slide 🎉</div>
      </f-carousel-item>
    </f-carousel>
  </div>
</template>

<style scoped>
.demo {
  max-width: 600px;
  margin: 0 auto;
}
.custom {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0d1e73, #0437ce);
  color: #fff;
  font-size: 1.35rem;
  font-weight: 700;
}
</style>
