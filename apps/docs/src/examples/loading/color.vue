<script setup>
import { ref } from 'vue'
import { useLoading } from '@rukkiecodes/vue'

const loading = useLoading()
const panel = ref(null)
const colors = ['primary', 'success', 'danger', 'warning', '#7d33ff']

function open(color) {
  const handle = loading.open({ target: panel.value, color, type: 'points' })
  setTimeout(() => handle.close(), 2200)
}
</script>

<template>
  <div class="ld">
    <div ref="panel" class="ld__panel">Pick a color</div>
    <div class="ld__row">
      <f-btn v-for="c in colors" :key="c" size="small" variant="flat" :color="c" @click="open(c)">
        {{ c }}
      </f-btn>
    </div>
  </div>
</template>

<style scoped>
.ld {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 440px;
}
.ld__panel {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 140px;
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.08);
  font-size: 0.9rem;
  opacity: 0.7;
}
.ld__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
</style>
