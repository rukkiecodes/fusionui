<script setup lang="ts">
import { computed, ref } from 'vue'

const MAX = 40

const title = ref('Q3 launch — pricing page refresh')
const touched = ref(false)

const errors = computed(() => {
  const value = title.value.trim()
  if (!touched.value) return []
  if (!value) return ['Give the project a title.']
  if (value.length > MAX) return [`Titles are capped at ${MAX} characters.`]
  return []
})
</script>

<template>
  <div class="stack">
    <f-label for="project-title" text="Project title" />

    <input
      id="project-title"
      v-model="title"
      class="box"
      :class="{ 'box--error': errors.length > 0 }"
      placeholder="Name this project"
      @blur="touched = true"
    />

    <div class="foot">
      <f-messages :messages="errors" :active="errors.length > 0" color="danger" />
      <f-counter active :value="title.length" :max="MAX" />
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 380px;
}

.box {
  width: 100%;
  padding: 9px 11px;
  font: inherit;
  font-size: 0.83rem;
  color: rgba(var(--fui-theme-on-surface), 0.9);
  background: rgb(var(--fui-surface-2));
  border: 2px solid transparent;
  border-radius: var(--fui-radius-md);
  outline: none;
  transition: background-color 0.25s ease;
}

.box:focus {
  background: rgb(var(--fui-surface-3));
}

.box--error {
  background: rgba(var(--fui-theme-danger), 0.12);
  color: rgb(var(--fui-theme-danger));
}

.foot {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-height: 18px;
}
</style>
