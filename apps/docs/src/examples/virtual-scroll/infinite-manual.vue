<script setup>
import { ref } from 'vue'

const titles = [
  'Quarterly revenue.pdf',
  'Board deck.key',
  'Customer research.docx',
  'Brand guidelines.pdf',
  'Runway model.xlsx',
]

function makeFiles(from, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: from + i,
    title: titles[(from + i) % titles.length],
    size: `${(((from + i) * 37) % 900) + 100} kB`,
  }))
}

const files = ref(makeFiles(0, 8))
// The first request fails on purpose, so the built-in Retry button shows up.
let failed = false

function load({ done }) {
  setTimeout(() => {
    if (!failed) {
      failed = true
      done('error')
      return
    }
    if (files.value.length >= 32) {
      done('empty')
      return
    }
    files.value.push(...makeFiles(files.value.length, 8))
    done('ok')
  }, 800)
}
</script>

<template>
  <div class="w">
    <f-infinite-scroll mode="manual" height="300" load-more-text="Load more files" @load="load">
      <div v-for="file in files" :key="file.id" class="row">
        <f-icon icon="file-text" size="small" />
        <span>{{ file.title }}</span>
        <span class="row__size">{{ file.size }}</span>
      </div>
    </f-infinite-scroll>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  border-radius: var(--fui-radius-md);
}

.row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
  font-size: 0.875rem;
  text-align: start;
}

.row__size {
  font-size: 0.75rem;
  opacity: 0.55;
  font-variant-numeric: tabular-nums;
}
</style>
