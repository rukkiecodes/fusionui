<template>
  <f-timeline side="end" truncate-line="both" line-thickness="4">
    <f-timeline-item dot-color="primary">
      <strong>Draft</strong>
      <p>The line starts at the first dot and stops at the last.</p>
    </f-timeline-item>

    <f-timeline-item dot-color="primary">
      <strong>In review</strong>
    </f-timeline-item>

    <f-timeline-item dot-color="primary">
      <strong>Published</strong>
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
