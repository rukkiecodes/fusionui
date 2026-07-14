<script setup>
import { ref } from 'vue'
import { useLoading } from '@rukkiecodes/vue'

const loading = useLoading()
const panel = ref(null)

// Scoped to the panel, with a determinate bar driven through the handle.
function upload() {
  const handle = loading.open({
    target: panel.value,
    type: 'square',
    text: 'Uploading…',
    progress: 0,
  })

  let done = 0
  const timer = setInterval(() => {
    done += 7
    handle.update({ progress: Math.min(done, 100) })
    if (done >= 100) {
      clearInterval(timer)
      setTimeout(() => handle.close(), 350)
    }
  }, 120)
}

// No target ⇒ the overlay covers the page.
function block() {
  const handle = loading.open({ type: 'gradient', text: 'Signing you in…' })
  setTimeout(() => handle.close(), 1600)
}
</script>

<template>
  <div class="stack">
    <div ref="panel" class="panel">
      <strong>logo.svg</strong>
      <span>2.4 MB</span>
    </div>

    <div class="row">
      <f-btn color="primary" @click="upload">Upload (scoped)</f-btn>
      <f-btn variant="tonal" @click="block">Sign in (fullscreen)</f-btn>
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 420px;
}

.panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  min-height: 150px;
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.08);
  font-size: 0.9rem;
}

.panel span {
  font-size: 0.78rem;
  opacity: 0.6;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
