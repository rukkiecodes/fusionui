<script setup>
// A small per-page toolbar: copy the page as Markdown, or download the
// generated .md / .json (emitted next to the SPA by scripts/gen-ai-docs.mjs).
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const base = import.meta.env.BASE_URL
const slug = computed(() => route.path.replace(/^\/+|\/+$/g, '') || 'index')
const file = computed(() => slug.value.replace(/\//g, '-'))
const mdUrl = computed(() => `${base}${slug.value}.md`)
const jsonUrl = computed(() => `${base}${slug.value}.json`)

const copied = ref(false)
async function copyMd() {
  try {
    const res = await fetch(mdUrl.value)
    if (!res.ok) throw new Error('not found')
    await navigator.clipboard.writeText(await res.text())
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    /* in dev the static files aren't generated yet */
  }
}
</script>

<template>
  <div class="page-actions">
    <button
      class="page-actions__btn"
      type="button"
      title="Copy this page as Markdown"
      @click="copyMd"
    >
      <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
      <span>{{ copied ? 'Copied' : 'Copy as Markdown' }}</span>
    </button>
    <a class="page-actions__btn" :href="mdUrl" :download="`${file}.md`" title="Download Markdown">
      <f-icon icon="download" size="small" /><span>.md</span>
    </a>
    <a class="page-actions__btn" :href="jsonUrl" :download="`${file}.json`" title="Download JSON">
      <f-icon icon="download" size="small" /><span>.json</span>
    </a>
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
.page-actions__btn:hover {
  background: rgba(var(--fui-theme-primary), 0.12);
  color: rgb(var(--fui-theme-primary));
}
</style>
