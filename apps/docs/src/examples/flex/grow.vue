<template>
  <div class="util-demo">
    <div class="util-demo__row">
      <span class="util-demo__label">flex-grow-1 on the middle item</span>
      <div class="util-demo__box d-flex ga-2">
        <div class="util-demo__item">auto</div>
        <div class="util-demo__item flex-grow-1">flex-grow-1 (takes the slack)</div>
        <div class="util-demo__item">auto</div>
      </div>
    </div>
    <div class="util-demo__row">
      <span class="util-demo__label">flex-fill — every item shares the width equally</span>
      <div class="util-demo__box d-flex ga-2">
        <div class="util-demo__item flex-fill">1</div>
        <div class="util-demo__item flex-fill">2</div>
        <div class="util-demo__item flex-fill">3</div>
      </div>
    </div>
  </div>
</template>
