<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
const people = [
  { src: 'foto1.png', name: 'Alex, 27' },
  { src: 'foto6.png', name: 'Sam, 24' },
  { src: 'foto13.png', name: 'Jordan, 30' },
  { src: 'foto5.png', name: 'Riley, 26' },
]
</script>

<template>
  <f-card type="11" style="max-width: 280px">
    <div v-for="p in people" :key="p.name">
      <img :src="img(p.src)" alt="" />
      <div class="deck-name">{{ p.name }}</div>
    </div>
  </f-card>
</template>

<style scoped>
.deck-name {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 30px 18px 16px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
}
</style>
