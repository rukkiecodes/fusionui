<template>
  <f-timeline side="end" line-color="secondary">
    <f-timeline-item dot-color="success" icon="check" icon-color="success">
      <strong>Tests passed</strong>
      <p>412 tests, 0 failures.</p>
    </f-timeline-item>

    <f-timeline-item dot-color="warning" icon="alert-triangle" icon-color="warning" size="large">
      <strong>Bundle size grew by 4 kB</strong>
      <p>A larger dot for the step that needs attention.</p>
    </f-timeline-item>

    <f-timeline-item dot-color="danger" icon="x" icon-color="danger" size="x-small">
      <strong>Deploy cancelled</strong>
      <p>Waiting for the size budget to be signed off.</p>
    </f-timeline-item>
  </f-timeline>
</template>

<style scoped>
p {
  margin: 4px 0 0;
  font-size: 0.875rem;
  opacity: 0.75;
}
</style>
