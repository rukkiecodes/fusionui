<template>
  <div class="grid-demo">
    <!-- "auto" fits its content; the plain column fills the remaining space. -->
    <f-row>
      <f-col cols="auto"><div class="grid-demo__cell">auto</div></f-col>
      <f-col><div class="grid-demo__cell">fills the rest</div></f-col>
      <f-col cols="auto"><div class="grid-demo__cell">auto</div></f-col>
    </f-row>
  </div>
</template>
