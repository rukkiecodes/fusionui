<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <vd-card type="12" style="max-width: 360px">
    <template #avatar><img :src="img('foto5.png')" alt="" /></template>
    <template #header>
      <strong>traveldaily</strong>
      <span>Santorini, Greece</span>
    </template>
    <template #img><img :src="img('foto4.png')" alt="" /></template>
    <template #actions>
      <button class="vd-act"><vd-icon icon="heart" /></button>
      <button class="vd-act"><vd-icon icon="message-circle" /></button>
      <button class="vd-act"><vd-icon icon="send" /></button>
      <vd-spacer />
      <button class="vd-act"><vd-icon icon="bookmark" /></button>
    </template>
    <template #text>
      <p><strong>2,418 likes</strong></p>
      <p><strong>traveldaily</strong> Golden hour never disappoints ✨</p>
    </template>
  </vd-card>
</template>
