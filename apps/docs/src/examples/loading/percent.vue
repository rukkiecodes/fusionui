<script setup>
import { ref } from 'vue'
import { useLoading } from '@rukkiecodes/vue'

const loading = useLoading()
const panel = ref(null)

function open() {
  let n = 0
  const handle = loading.open({ target: panel.value, type: 'gradient', percent: '0%', scale: 1.4 })
  const timer = setInterval(() => {
    n += 4
    handle.update({ percent: `${n}%` })
    if (n >= 100) {
      clearInterval(timer)
      setTimeout(() => handle.close(), 400)
    }
  }, 90)
}
</script>

<template>
  <div class="ld">
    <div ref="panel" class="ld__panel">A percentage shown inside the spinner</div>
    <f-btn color="primary" @click="open">Open</f-btn>
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
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 150px;
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.08);
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>
