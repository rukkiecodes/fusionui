<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { FShaderSurface, effects } from '@rukkiecodes/shaders'

const names = Object.keys(effects)
const cfg = reactive({
  effect: 'gradient',
  colorA: '#195bff',
  colorB: '#7d33ff',
  intensity: 0.9,
})
const rationale = computed(() => effects[cfg.effect]?.rationale ?? '')

const code = computed(
  () =>
    `<FShaderSurface\n  effect="${cfg.effect}"\n  color-a="${cfg.colorA}"\n  color-b="${cfg.colorB}"\n  :intensity="${cfg.intensity}"\n/>`
)
const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="sp">
    <div class="sp__stage">
      <FShaderSurface
        :effect="cfg.effect"
        :color-a="cfg.colorA"
        :color-b="cfg.colorB"
        :intensity="cfg.intensity"
        :style="{ width: '100%', height: '320px', borderRadius: 'var(--fui-radius-lg)' }"
      >
        <div class="sp__label">
          <strong>{{ cfg.effect }}</strong>
          <span>{{ rationale }}</span>
          <em v-if="cfg.effect === 'displace'">move your cursor over the surface</em>
        </div>
      </FShaderSurface>
    </div>

    <div class="sp__panel">
      <div class="sp__effects">
        <button
          v-for="n in names"
          :key="n"
          class="sp__chip"
          :class="{ 'sp__chip--active': cfg.effect === n }"
          @click="cfg.effect = n"
        >
          {{ n }}
        </button>
      </div>
      <label class="sp__row">Color A <input v-model="cfg.colorA" type="color" /></label>
      <label class="sp__row">Color B <input v-model="cfg.colorB" type="color" /></label>
      <label
        >Intensity <code>{{ cfg.intensity }}</code
        ><input v-model.number="cfg.intensity" type="range" min="0" max="1" step="0.05"
      /></label>
      <button class="sp__copy" @click="copy">
        <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        {{ copied ? 'Copied' : 'Copy code' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.sp {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 16px;
  margin: 16px 0;
}
@media (max-width: 720px) {
  .sp {
    grid-template-columns: 1fr;
  }
}
.sp__stage {
  min-width: 0;
}
.sp__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  padding: 0 24px;
}
.sp__label strong {
  font-size: 22px;
  text-transform: capitalize;
}
.sp__label span {
  font-size: 13px;
  opacity: 0.92;
  max-width: 420px;
}
.sp__label em {
  font-size: 12px;
  opacity: 0.8;
}
.sp__panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
}
.sp__effects {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.sp__chip {
  padding: 5px 10px;
  border-radius: var(--fui-radius-pill);
  border: 1px solid rgba(var(--fui-border-color), 0.2);
  background: transparent;
  color: inherit;
  font-size: 12px;
  cursor: pointer;
  text-transform: capitalize;
}
.sp__chip--active {
  background: rgb(var(--fui-theme-primary));
  color: #fff;
  border-color: transparent;
}
.sp__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
}
.sp__panel label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.sp__panel label code {
  font-family: var(--fui-font-family-mono);
  opacity: 0.65;
  font-weight: 400;
}
.sp__panel input[type='range'] {
  width: 100%;
  accent-color: rgb(var(--fui-theme-primary));
}
.sp__copy {
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
