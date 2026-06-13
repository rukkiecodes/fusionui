<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <f-card type="12">
    <template #avatar><img :src="img('foto1.png')" alt="" /></template>
    <template #header>
      <strong>Jane Doe</strong>
      <span>@janedoe · 2h</span>
    </template>
    <template #text>
      <p>Just shipped a brand-new Vue design library — five card types and counting 🎨🚀</p>
    </template>
    <template #img><img :src="img('foto2.jpg')" alt="" /></template>
    <template #actions>
      <button class="fui-act"><f-icon icon="message-circle" size="small" /> 12</button>
      <button class="fui-act"><f-icon icon="repeat" size="small" /> 48</button>
      <button class="fui-act"><f-icon icon="heart" size="small" /> 312</button>
      <button class="fui-act"><f-icon icon="bar-chart-2" size="small" /> 9.8k</button>
    </template>
  </f-card>
</template>
