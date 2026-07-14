<script setup lang="ts">
const panels = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Panel ${i + 1}`,
}))
</script>

<template>
  <div class="scroller">
    <p class="hint">Scroll — each panel only mounts once it comes into view.</p>

    <f-lazy
      v-for="panel in panels"
      :key="panel.id"
      :min-height="120"
      :options="{ rootMargin: '0px' }"
      class="slot"
    >
      <template #placeholder>
        <f-skeleton type="heading, text" />
      </template>

      <f-card class="panel">
        <f-card-title>{{ panel.title }}</f-card-title>
        <f-card-text>Mounted when it scrolled into view.</f-card-text>
      </f-card>
    </f-lazy>
  </div>
</template>

<style scoped>
.scroller {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 8px;
}
.hint {
  opacity: 0.7;
  font-size: 0.85rem;
}
.slot {
  margin-bottom: 12px;
}
.panel {
  padding: 8px;
}
</style>
