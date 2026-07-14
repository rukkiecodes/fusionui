<script setup>
import { ref } from 'vue'

const open = ref(false)
const guarded = ref(true)
const trigger = ref(null)
const log = ref('')

// Elements that should NOT count as "outside". Without the trigger in here, the
// click that closes the panel is the same click that reopens it.
const include = () => (guarded.value && trigger.value ? [trigger.value] : [])

function onOutside(e) {
  open.value = false
  log.value = `closed by a click on <${e.target.tagName.toLowerCase()}>`
}
</script>

<template>
  <div class="wrap">
    <div class="stage">
      <button ref="trigger" class="trigger" @click="open = !open">
        Filters
        <f-icon :icon="open ? 'chevron-up' : 'chevron-down'" size="x-small" />
      </button>

      <div v-if="open" v-click-outside="{ handler: onOutside, include }" class="panel">
        <strong>Panel</strong>
        <p>Click anywhere out here to close me. Clicking inside does nothing.</p>
      </div>
    </div>

    <div class="controls">
      <f-switch v-model="guarded">Guard the trigger with <code>include</code></f-switch>
      <p class="log">{{ log || 'No outside click yet.' }}</p>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.stage {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 160px;
  padding-top: 8px;
}
.trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 14px;
  border: thin solid rgba(var(--fui-theme-on-background), 0.16);
  border-radius: var(--fui-radius-md);
  background: rgb(var(--fui-theme-surface));
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.panel {
  position: absolute;
  top: 56px;
  width: 260px;
  padding: 14px;
  border-radius: var(--fui-radius-md);
  background: rgb(var(--fui-theme-surface));
  box-shadow: var(--fui-elevation-4);
}
.panel p {
  margin: 6px 0 0;
  font-size: 0.85rem;
  opacity: 0.75;
}
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.log {
  margin: 0;
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.78rem;
  opacity: 0.6;
}
code {
  font-family: var(--fui-font-family-mono, monospace);
}
</style>
