<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <vd-card type="13">
    <template #avatar><img :src="img('foto6.png')" alt="" /></template>
    <template #header>
      <strong>Ada Lovelace</strong>
      <span>Yesterday at 14:32 · 🌍</span>
    </template>
    <template #text>
      <p>Spent the afternoon in the hills. Worth every step. 🥾⛰️</p>
    </template>
    <template #img><img :src="img('foto13.png')" alt="" /></template>
    <template #actions>
      <button class="vd-act"><vd-icon icon="thumbs-up" size="small" /> Like</button>
      <button class="vd-act"><vd-icon icon="message-circle" size="small" /> Comment</button>
      <button class="vd-act"><vd-icon icon="share-2" size="small" /> Share</button>
    </template>
  </vd-card>
</template>
