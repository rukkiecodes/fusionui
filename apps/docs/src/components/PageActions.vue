<script setup>
// Copy the page as Markdown, or download it as .md / .json. The content is
// built in the browser from the page's source (works in dev and prod), and
// matches the static files the generator emits for crawlers.
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { buildPage } from '../util/page-export.mjs'

const route = useRoute()
const file = computed(() => (route.path.replace(/^\/+|\/+$/g, '') || 'index').replace(/\//g, '-'))
const copied = ref(false)
const busy = ref(false)

function save(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function copyMarkdown() {
  busy.value = true
  try {
    const page = await buildPage(route.path)
    if (!page) return
    await navigator.clipboard.writeText(page.mdFull)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } finally {
    busy.value = false
  }
}

async function download(kind) {
  busy.value = true
  try {
    const page = await buildPage(route.path)
    if (!page) return
    if (kind === 'md') save(`${file.value}.md`, page.mdFull, 'text/markdown;charset=utf-8')
    else save(`${file.value}.json`, JSON.stringify(page.json, null, 2), 'application/json')
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="page-actions">
    <button
      class="page-actions__btn"
      type="button"
      :disabled="busy"
      title="Copy this page as Markdown"
      @click="copyMarkdown"
    >
      <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
      <span>{{ copied ? 'Copied' : 'Copy as Markdown' }}</span>
    </button>
    <button
      class="page-actions__btn"
      type="button"
      :disabled="busy"
      title="Download Markdown"
      @click="download('md')"
    >
      <f-icon icon="download" size="small" /><span>.md</span>
    </button>
    <button
      class="page-actions__btn"
      type="button"
      :disabled="busy"
      title="Download JSON"
      @click="download('json')"
    >
      <f-icon icon="download" size="small" /><span>.json</span>
    </button>
  </div>
</template>

<style scoped>
.page-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 8px;
}
.page-actions__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--fui-radius-md, 12px);
  background: rgb(var(--fui-surface-2));
  color: rgba(var(--fui-theme-on-surface), 0.78);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.18s ease;
}
.page-actions__btn:hover:not(:disabled) {
  background: rgba(var(--fui-theme-primary), 0.12);
  color: rgb(var(--fui-theme-primary));
}
.page-actions__btn:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
