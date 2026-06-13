<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <f-card type="14" style="max-width: 360px">
    <template #avatar><img :src="img('foto5.png')" alt="" /></template>
    <template #header>
      <strong>traveldaily</strong>
      <span>Santorini, Greece</span>
    </template>
    <template #img><img :src="img('foto4.png')" alt="" /></template>
    <template #actions>
      <button class="fui-act"><f-icon icon="heart" /></button>
      <button class="fui-act"><f-icon icon="message-circle" /></button>
      <button class="fui-act"><f-icon icon="send" /></button>
      <f-spacer />
      <button class="fui-act"><f-icon icon="bookmark" /></button>
    </template>
    <template #text>
      <p><strong>2,418 likes</strong></p>
      <p><strong>traveldaily</strong> Golden hour never disappoints ✨</p>
    </template>
  </f-card>
</template>
