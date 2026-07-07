<script setup>
// Each maps to a `justify-{value}` class on a d-flex container.
const options = ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly']
</script>

<template>
  <div class="util-demo">
    <div v-for="o in options" :key="o" class="util-demo__row">
      <span class="util-demo__label">justify-{{ o }}</span>
      <div class="util-demo__box d-flex ga-2" :class="`justify-${o}`">
        <div class="util-demo__item">1</div>
        <div class="util-demo__item">2</div>
        <div class="util-demo__item">3</div>
      </div>
    </div>
  </div>
</template>
