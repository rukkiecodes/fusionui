<script setup lang="ts">
const message =
  'The build for main #4821 failed during the type-check step. The error came from ' +
  'packages/vue/src/components/FTimeline/FTimelineItem.tsx, where the dot size resolver ' +
  'no longer accepts a plain number. Re-run the job after pushing a fix, or open the full ' +
  'log to see the surrounding output.'
</script>

<template>
  <div class="stack">
    <f-banner lines="one" icon="alert-triangle" color="danger" :text="message" rounded />
    <f-banner lines="two" icon="alert-triangle" color="danger" :text="message" rounded />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 560px;
}
</style>
