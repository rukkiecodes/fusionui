<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { iconNames } from '@fusionui/icons'

const PER_PAGE = 200

const query = ref('')
const page = ref(1)
const copied = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? iconNames.filter(n => n.includes(q)) : iconNames
})
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)))
const pageItems = computed(() =>
  filtered.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE)
)

// Reset to the first page whenever the search changes; clamp if the result set shrank.
watch(query, () => (page.value = 1))
watch(pageCount, n => {
  if (page.value > n) page.value = n
})

let toastTimer: ReturnType<typeof setTimeout> | undefined
async function copy(name: string) {
  try {
    await navigator.clipboard.writeText(`<f-icon icon="${name}" />`)
  } catch {
    /* clipboard blocked — still flash the name */
  }
  copied.value = name
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (copied.value = ''), 1400)
}
</script>

<template>
  <div class="ig">
    <div class="ig__bar">
      <f-input v-model="query" class="ig__search" placeholder="Search icons by name…" />
      <span class="ig__count">{{ filtered.length.toLocaleString() }} icons</span>
    </div>

    <div v-if="pageItems.length" class="ig__grid">
      <button
        v-for="name in pageItems"
        :key="name"
        type="button"
        class="ig__cell"
        :title="`Copy <f-icon icon=&quot;${name}&quot; />`"
        @click="copy(name)"
      >
        <f-icon :icon="name" :size="22" />
        <span class="ig__name">{{ name }}</span>
      </button>
    </div>
    <p v-else class="ig__empty">No icons match “{{ query }}”.</p>

    <div v-if="pageCount > 1" class="ig__pager">
      <f-btn variant="tonal" size="small" :disabled="page === 1" @click="page = 1">« First</f-btn>
      <f-btn variant="tonal" size="small" :disabled="page === 1" @click="page--">‹ Prev</f-btn>
      <span class="ig__pageinfo">Page {{ page }} of {{ pageCount }}</span>
      <f-btn variant="tonal" size="small" :disabled="page === pageCount" @click="page++"
        >Next ›</f-btn
      >
      <f-btn variant="tonal" size="small" :disabled="page === pageCount" @click="page = pageCount">
        Last »
      </f-btn>
    </div>

    <transition name="ig-toast">
      <div v-if="copied" class="ig__toast">
        Copied <code>&lt;f-icon icon="{{ copied }}" /&gt;</code>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.ig {
  margin: 20px 0;
}
.ig__bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}
.ig__search {
  flex: 1;
  max-width: 380px;
}
.ig__count {
  font-size: 0.85rem;
  opacity: 0.6;
  white-space: nowrap;
}
.ig__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 10px;
}
.ig__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 16px 8px 12px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-md);
  background: rgb(var(--fui-theme-surface));
  color: rgb(var(--fui-theme-on-surface));
  cursor: pointer;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}
.ig__cell:hover {
  transform: translateY(-3px);
  border-color: rgb(var(--fui-theme-primary));
  box-shadow: 0 8px 20px -10px rgba(var(--fui-theme-primary), 0.6);
  color: rgb(var(--fui-theme-primary));
}
.ig__name {
  font-size: 0.68rem;
  line-height: 1.2;
  text-align: center;
  word-break: break-word;
  opacity: 0.75;
}
.ig__empty {
  padding: 40px 0;
  text-align: center;
  opacity: 0.6;
}
.ig__pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 22px;
  flex-wrap: wrap;
}
.ig__pageinfo {
  font-size: 0.85rem;
  opacity: 0.7;
  min-width: 120px;
  text-align: center;
}
.ig__toast {
  position: fixed;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  padding: 10px 16px;
  border-radius: var(--fui-radius-md);
  background: rgb(var(--fui-theme-on-surface));
  color: rgb(var(--fui-theme-surface));
  font-size: 0.82rem;
  box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.4);
}
.ig__toast code {
  background: rgba(255, 255, 255, 0.16);
  padding: 1px 5px;
  border-radius: 4px;
}
.ig-toast-enter-active,
.ig-toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.ig-toast-enter-from,
.ig-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
