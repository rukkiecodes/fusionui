<script setup>
const src = 'https://picsum.photos/seed/fusionui-forest/1200/700'
</script>

<template>
  <div class="demo">
    <f-image
      :src="src"
      gradient="to top, rgba(0,0,0,.7), transparent 55%"
      aspect-ratio="16/9"
      cover
      rounded
    >
      <div class="caption">
        <strong>Forest Retreat</strong>
        <span>Ratanakiri, Cambodia</span>
      </div>
    </f-image>
  </div>
</template>

<style scoped>
.demo {
  max-width: 520px;
  margin: 0 auto;
}
.caption {
  position: absolute;
  left: 18px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  color: #fff;
}
.caption strong {
  font-size: 1.15rem;
}
.caption span {
  font-size: 0.85rem;
  opacity: 0.85;
}
</style>
