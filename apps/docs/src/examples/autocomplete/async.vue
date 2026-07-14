<script setup>
import { ref, watch } from 'vue'

const repo = ref(null)
const search = ref('')
const items = ref([])
const loading = ref(false)

const catalog = [
  'vuejs/core',
  'vuejs/router',
  'vitejs/vite',
  'vitest-dev/vitest',
  'nuxt/nuxt',
  'pinia/pinia',
]

// The typed text is read straight off the field's native `input` event, which
// bubbles out of the component.
function onSearch(e) {
  search.value = e.target.value
}

// Stand-in for a real endpoint: the query goes to the server, so `no-filter`
// keeps the menu from filtering the results a second time.
watch(search, query => {
  if (!query) {
    items.value = []
    return
  }
  loading.value = true
  setTimeout(() => {
    items.value = catalog.filter(r => r.includes(query.toLowerCase()))
    loading.value = false
  }, 600)
})
</script>

<template>
  <div class="w">
    <f-autocomplete
      v-model="repo"
      :items="items"
      :loading="loading"
      no-filter
      no-data-text="Type to search repositories"
      label="Repository"
      placeholder="vue, vite, pinia…"
      @input="onSearch"
    />
    <code>{{ repo ?? 'null' }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
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
