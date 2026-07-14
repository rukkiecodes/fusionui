<script setup lang="ts">
const releases = [
  { version: '1.2.0', note: 'Liquid glass surfaces' },
  { version: '1.1.0', note: 'Timeline and expansion panels' },
  { version: '1.0.0', note: 'First stable release' },
]
</script>

<template>
  <div class="grid">
    <div v-for="density in ['default', 'comfortable', 'compact']" :key="density" class="cell">
      <span class="label">{{ density }}</span>
      <f-timeline :density="density" size="small">
        <f-timeline-item v-for="release in releases" :key="release.version">
          <strong>v{{ release.version }}</strong>
          <p>{{ release.note }}</p>
        </f-timeline-item>
      </f-timeline>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label {
  font-family: var(--fui-font-family-mono);
  font-size: 0.75rem;
  opacity: 0.6;
}

p {
  margin: 2px 0 0;
  font-size: 0.8125rem;
  opacity: 0.75;
}
</style>
