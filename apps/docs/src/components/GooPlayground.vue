<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { FGoo } from '@fusionui/vue'

const cfg = reactive({
  count: 7,
  kernel: 'cubic' as 'cubic' | 'inverseSquare' | 'gaussian',
  reach: 0.5,
  cohesion: 45,
  gather: 4,
  viscosity: 1.4,
  pointer: -600,
  mode: 'contour' as 'contour' | 'filter',
})

// Remount the field when structural options change so blobs re-seed cleanly.
const key = computed(() => `${cfg.count}-${cfg.kernel}-${cfg.mode}`)

const code = computed(
  () =>
    `<FGoo\n  :count="${cfg.count}"\n  kernel="${cfg.kernel}"\n  :reach="${cfg.reach}"\n  :pointer="${cfg.pointer}"\n  mode="${cfg.mode}"\n  style="width:100%;height:320px"\n/>`
)
const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="goop">
    <div class="goop__stage">
      <FGoo
        :key="key"
        :count="cfg.count"
        :kernel="cfg.kernel"
        :reach="cfg.reach"
        :cohesion="cfg.cohesion"
        :gather="cfg.gather"
        :viscosity="cfg.viscosity"
        :pointer="cfg.pointer"
        :mode="cfg.mode"
        style="width: 100%; height: 320px"
      />
      <span class="goop__hint">move your cursor through the goo</span>
    </div>

    <div class="goop__panel">
      <label class="goop__row">
        Kernel
        <select v-model="cfg.kernel">
          <option value="cubic">cubic</option>
          <option value="inverseSquare">inverseSquare</option>
          <option value="gaussian">gaussian</option>
        </select>
      </label>
      <label class="goop__row">
        Mode
        <select v-model="cfg.mode">
          <option value="contour">contour</option>
          <option value="filter">filter</option>
        </select>
      </label>
      <label
        >Blobs <code>{{ cfg.count }}</code
        ><input v-model.number="cfg.count" type="range" min="2" max="14"
      /></label>
      <label
        >Reach <code>{{ cfg.reach }}</code
        ><input v-model.number="cfg.reach" type="range" min="0.1" max="0.9" step="0.05"
      /></label>
      <label
        >Cohesion <code>{{ cfg.cohesion }}</code
        ><input v-model.number="cfg.cohesion" type="range" min="0" max="120"
      /></label>
      <label
        >Gather <code>{{ cfg.gather }}</code
        ><input v-model.number="cfg.gather" type="range" min="0" max="20"
      /></label>
      <label
        >Viscosity <code>{{ cfg.viscosity }}</code
        ><input v-model.number="cfg.viscosity" type="range" min="0" max="4" step="0.1"
      /></label>
      <label
        >Pointer <code>{{ cfg.pointer }}</code
        ><input v-model.number="cfg.pointer" type="range" min="-1200" max="1200" step="50"
      /></label>
      <button class="goop__copy" @click="copy">
        <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        {{ copied ? 'Copied' : 'Copy code' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.goop {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 16px;
  margin: 16px 0;
}
@media (max-width: 720px) {
  .goop {
    grid-template-columns: 1fr;
  }
}
.goop__stage {
  position: relative;
  height: 320px;
  border-radius: var(--fui-radius-lg);
  overflow: hidden;
  background: rgb(var(--fui-surface-2));
  color: rgb(var(--fui-theme-primary));
}
.goop__hint {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  font-size: 12px;
  opacity: 0.5;
  pointer-events: none;
}
.goop__panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
}
.goop__panel label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.goop__panel label code {
  font-family: var(--fui-font-family-mono);
  opacity: 0.65;
  font-weight: 400;
}
.goop__row {
  flex-direction: row !important;
  align-items: center;
  justify-content: space-between;
}
.goop__panel input[type='range'] {
  width: 100%;
  accent-color: rgb(var(--fui-theme-primary));
}
.goop__panel select {
  padding: 6px 8px;
  border-radius: var(--fui-radius-sm);
  border: 1px solid rgba(var(--fui-border-color), 0.2);
  background: rgb(var(--fui-theme-surface));
  color: inherit;
}
.goop__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  margin-top: 4px;
  padding: 8px;
  border: none;
  border-radius: var(--fui-radius-sm);
  background: rgb(var(--fui-theme-primary));
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}
</style>
