<script setup>
// ga-N pulls from the spacing scale: 2 = 8px, 4 = 16px, 6 = 32px.
const gaps = [2, 4, 6]
</script>

<template>
  <div class="util-demo">
    <div v-for="g in gaps" :key="g" class="util-demo__row">
      <span class="util-demo__label">d-flex ga-{{ g }}</span>
      <div class="util-demo__box d-flex" :class="`ga-${g}`">
        <div v-for="n in 4" :key="n" class="util-demo__item">{{ n }}</div>
      </div>
    </div>
  </div>
</template>
