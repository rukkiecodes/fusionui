<template>
  <f-timeline side="end" fill-dot icon-color="light">
    <f-timeline-item dot-color="primary" icon="package">
      <template #opposite>
        <span class="stamp">09:14</span>
      </template>
      <strong>Parcel scanned in Rotterdam</strong>
    </f-timeline-item>

    <f-timeline-item dot-color="primary" icon="truck">
      <template #opposite>
        <span class="stamp">13:02</span>
      </template>
      <strong>Left the sorting centre</strong>
    </f-timeline-item>

    <f-timeline-item dot-color="success" icon="home">
      <template #opposite>
        <span class="stamp">17:41</span>
      </template>
      <strong>Delivered to the front desk</strong>
    </f-timeline-item>
  </f-timeline>
</template>

<style scoped>
.stamp {
  font-family: var(--fui-font-family-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
}
</style>
