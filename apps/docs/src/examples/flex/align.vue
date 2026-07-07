<script setup>
// Each maps to an `align-{value}` class (align-items) on a tall d-flex container.
const options = ['start', 'center', 'end', 'stretch']
</script>

<template>
  <div class="util-demo">
    <div v-for="o in options" :key="o" class="util-demo__row">
      <span class="util-demo__label">align-{{ o }}</span>
      <div class="util-demo__box d-flex ga-2" :class="`align-${o}`" style="height: 110px">
        <div class="util-demo__item">1</div>
        <div class="util-demo__item util-demo__item--tall">2</div>
        <div class="util-demo__item">3</div>
      </div>
    </div>
  </div>
</template>
