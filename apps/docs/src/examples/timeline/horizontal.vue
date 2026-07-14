<template>
  <f-timeline direction="horizontal" fill-dot icon-color="light" size="small">
    <f-timeline-item dot-color="success" icon="check">
      <template #opposite>
        <span class="stamp">Mon</span>
      </template>
      <strong class="step">Kickoff</strong>
    </f-timeline-item>

    <f-timeline-item dot-color="success" icon="check">
      <template #opposite>
        <span class="stamp">Wed</span>
      </template>
      <strong class="step">Design review</strong>
    </f-timeline-item>

    <f-timeline-item dot-color="primary" icon="pencil">
      <template #opposite>
        <span class="stamp">Fri</span>
      </template>
      <strong class="step">Build</strong>
    </f-timeline-item>

    <f-timeline-item dot-color="dark" icon="rocket">
      <template #opposite>
        <span class="stamp">Next Tue</span>
      </template>
      <strong class="step">Ship</strong>
    </f-timeline-item>
  </f-timeline>
</template>

<style scoped>
.step {
  display: block;
  min-width: 120px;
}

.stamp {
  font-family: var(--fui-font-family-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
}
</style>
