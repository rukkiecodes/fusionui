<template>
  <f-timeline side="end">
    <f-timeline-item dot-color="success" icon="git-commit">
      <strong>feat: add the timeline component</strong>
      <p>3 files changed · 2 hours ago</p>
    </f-timeline-item>

    <f-timeline-item dot-color="primary" icon="git-branch">
      <strong>Branch merged into main</strong>
      <p>Fast-forward · 1 hour ago</p>
    </f-timeline-item>

    <f-timeline-item dot-color="warning" icon="rocket" side="start">
      <strong>Deployed to staging</strong>
      <p>This item pins itself to the other side.</p>
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
