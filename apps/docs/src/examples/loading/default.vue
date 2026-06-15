<script setup>
import { ref } from 'vue'
import { useLoading } from '@rukkiecodes/vue'

const loading = useLoading()
const panel = ref(null)

function open() {
  const handle = loading.open({ target: panel.value, text: 'Loading…' })
  setTimeout(() => handle.close(), 2500)
}
</script>

<template>
  <div class="ld">
    <div ref="panel" class="ld__panel">
      <strong>Dashboard</strong>
      <p>Scope a loader to any element by passing it as <code>target</code>.</p>
    </div>
    <f-btn color="primary" @click="open">Open loading</f-btn>
  </div>
</template>

<style scoped>
.ld {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 420px;
}
.ld__panel {
  position: relative;
  width: 100%;
  min-height: 150px;
  padding: 20px;
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.08);
}
.ld__panel p {
  margin: 8px 0 0;
  font-size: 0.88rem;
  opacity: 0.7;
}
.ld__panel code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 1px 5px;
  border-radius: 5px;
}
</style>
