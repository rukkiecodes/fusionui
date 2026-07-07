<template>
  <div class="grid-demo">
    <!-- Source order is First, Second, Third — visual order is reassigned. -->
    <f-row>
      <f-col cols="4" order="last"><div class="grid-demo__cell">First (order last)</div></f-col>
      <f-col cols="4"><div class="grid-demo__cell">Second</div></f-col>
      <f-col cols="4" order="first"><div class="grid-demo__cell">Third (order first)</div></f-col>
    </f-row>
  </div>
</template>
