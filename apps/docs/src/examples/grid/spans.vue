<template>
  <div class="grid-demo">
    <f-row>
      <f-col cols="12"><div class="grid-demo__cell">cols 12</div></f-col>
    </f-row>
    <f-row>
      <f-col cols="6"><div class="grid-demo__cell">6</div></f-col>
      <f-col cols="6"><div class="grid-demo__cell">6</div></f-col>
    </f-row>
    <f-row>
      <f-col cols="4"><div class="grid-demo__cell">4</div></f-col>
      <f-col cols="4"><div class="grid-demo__cell">4</div></f-col>
      <f-col cols="4"><div class="grid-demo__cell">4</div></f-col>
    </f-row>
    <f-row>
      <f-col v-for="n in 4" :key="n" cols="3"><div class="grid-demo__cell">3</div></f-col>
    </f-row>
  </div>
</template>
