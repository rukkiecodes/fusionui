<script setup lang="ts">
// A copyable one-line shell command (the `npx … add` / `expo install` lines).
import { ref } from 'vue'

const props = defineProps<{ command: string; label?: string }>()
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<template>
  <div class="cmd">
    <span v-if="label" class="cmd__label">{{ label }}</span>
    <button class="cmd__box" :aria-label="`Copy: ${command}`" @click="copy">
      <code>{{ command }}</code>
      <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
    </button>
  </div>
</template>

<style scoped>
.cmd {
  margin: 0 0 12px;
}
.cmd__label {
  display: block;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(var(--fui-theme-on-surface), 0.5);
  margin-bottom: 5px;
}
.cmd__box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  background: rgb(var(--fui-theme-surface));
  color: rgb(var(--fui-theme-on-surface));
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease;
}
.cmd__box:hover {
  border-color: rgba(var(--fui-theme-primary), 0.5);
}
.cmd__box code {
  font-size: 0.9rem;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
