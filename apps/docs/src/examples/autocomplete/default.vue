<script setup>
import { ref } from 'vue'

const country = ref(null)
const countries = [
  'Argentina',
  'Australia',
  'Belgium',
  'Brazil',
  'Canada',
  'Denmark',
  'France',
  'Germany',
  'Ghana',
  'Japan',
  'Kenya',
  'Nigeria',
  'Portugal',
  'Spain',
  'United Kingdom',
]
</script>

<template>
  <div class="w">
    <f-autocomplete
      v-model="country"
      :items="countries"
      label="Country"
      placeholder="Start typing…"
      clearable
    />
    <code>{{ country ?? 'null' }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
