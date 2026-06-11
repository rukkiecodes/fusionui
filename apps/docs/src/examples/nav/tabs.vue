<script setup>
import { ref } from 'vue'
const tab = ref('overview')
</script>

<template>
  <div>
    <vd-tabs v-model="tab" color="primary">
      <vd-tab value="overview" text="Overview" />
      <vd-tab value="pricing" text="Pricing" />
      <vd-tab value="reviews" text="Reviews" />
    </vd-tabs>
    <vd-tabs-window v-model="tab">
      <vd-tab-panel value="overview">A quick overview of the product.</vd-tab-panel>
      <vd-tab-panel value="pricing">Simple, transparent pricing.</vd-tab-panel>
      <vd-tab-panel value="reviews">What customers are saying.</vd-tab-panel>
    </vd-tabs-window>
  </div>
</template>
