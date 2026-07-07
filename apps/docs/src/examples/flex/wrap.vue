<template>
  <div class="util-demo">
    <span class="util-demo__label">flex-wrap — items flow onto new lines</span>
    <div class="util-demo__box d-flex flex-wrap ga-2">
      <div v-for="n in 12" :key="n" class="util-demo__item" style="min-width: 90px">
        item {{ n }}
      </div>
    </div>
  </div>
</template>
