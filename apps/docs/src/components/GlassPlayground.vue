<script setup lang="ts">
import { computed, reactive, onBeforeUnmount, ref } from 'vue'
import { FGlass } from '@fusionui/vue'

const cfg = reactive({
  radius: 28,
  bezel: 18,
  depth: 16,
  ior: 1.45,
  blur: 2,
  saturation: 1.6,
  profile: 'lens' as 'lens' | 'smooth',
})

// Drag the glass slab around to feel the rim lens the backdrop underneath.
const stage = ref<HTMLElement | null>(null)
const pos = reactive({ x: 50, y: 45 }) // percent
let dragging = false

function onDown(e: PointerEvent) {
  dragging = true
  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
}
function onMove(e: PointerEvent) {
  if (!dragging || !stage.value) return
  const r = stage.value.getBoundingClientRect()
  pos.x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))
  pos.y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100))
}
function onUp() {
  dragging = false
}
onBeforeUnmount(() => (dragging = false))

const code = computed(
  () =>
    `<FGlass\n  :radius="${cfg.radius}"\n  :bezel="${cfg.bezel}"\n  :depth="${cfg.depth}"\n  :ior="${cfg.ior}"\n  profile="${cfg.profile}"\n  interactive\n>\n  <nav class="toolbar">…</nav>\n</FGlass>`
)
const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="gp">
    <div ref="stage" class="gp__stage" @pointermove="onMove" @pointerup="onUp" @pointerleave="onUp">
      <!-- A busy backdrop so the rim refraction is unmistakable. -->
      <div class="gp__backdrop">
        <span v-for="i in 11" :key="i" class="gp__stripe" />
        <div class="gp__type">FusionUI · liquid glass · drag me</div>
      </div>

      <FGlass
        class="gp__glass"
        :radius="cfg.radius"
        :bezel="cfg.bezel"
        :depth="cfg.depth"
        :ior="cfg.ior"
        :blur="cfg.blur"
        :saturation="cfg.saturation"
        :profile="cfg.profile"
        interactive
        :style="{ left: pos.x + '%', top: pos.y + '%' }"
        @pointerdown="onDown"
      >
        <div class="gp__card">
          <strong>Liquid glass</strong>
          <span>Snell-refracted rim · readable plateau</span>
        </div>
      </FGlass>
    </div>

    <div class="gp__panel">
      <label
        >Radius <code>{{ cfg.radius }}</code
        ><input v-model.number="cfg.radius" type="range" min="0" max="60"
      /></label>
      <label
        >Bezel <code>{{ cfg.bezel }}</code
        ><input v-model.number="cfg.bezel" type="range" min="4" max="48"
      /></label>
      <label
        >Depth <code>{{ cfg.depth }}</code
        ><input v-model.number="cfg.depth" type="range" min="2" max="40"
      /></label>
      <label
        >IOR <code>{{ cfg.ior }}</code
        ><input v-model.number="cfg.ior" type="range" min="1" max="2" step="0.01"
      /></label>
      <label
        >Blur <code>{{ cfg.blur }}</code
        ><input v-model.number="cfg.blur" type="range" min="0" max="12" step="0.5"
      /></label>
      <label
        >Saturation <code>{{ cfg.saturation }}</code
        ><input v-model.number="cfg.saturation" type="range" min="1" max="3" step="0.1"
      /></label>
      <label class="gp__profile">
        Profile
        <select v-model="cfg.profile">
          <option value="lens">lens</option>
          <option value="smooth">smooth</option>
        </select>
      </label>
      <button class="gp__copy" @click="copy">
        <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        {{ copied ? 'Copied' : 'Copy code' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.gp {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 16px;
  margin: 16px 0;
}
@media (max-width: 720px) {
  .gp {
    grid-template-columns: 1fr;
  }
}
.gp__stage {
  position: relative;
  height: 340px;
  border-radius: var(--fui-radius-lg);
  overflow: hidden;
  touch-action: none;
}
.gp__backdrop {
  position: absolute;
  inset: 0;
  display: flex;
  background: linear-gradient(120deg, #195bff, #7d33ff 45%, #ff4757 100%);
}
.gp__stripe {
  flex: 1;
  border-right: 2px solid rgba(255, 255, 255, 0.22);
}
.gp__type {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  text-align: center;
  padding: 0 24px;
}
.gp__glass {
  position: absolute;
  width: 240px;
  height: 132px;
  transform: translate(-50%, -50%);
  cursor: grab;
}
.gp__glass:active {
  cursor: grabbing;
}
.gp__card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
.gp__card strong {
  font-size: 18px;
}
.gp__card span {
  font-size: 12px;
  opacity: 0.9;
}
.gp__panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
}
.gp__panel label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.gp__panel label code {
  font-family: var(--fui-font-family-mono);
  opacity: 0.65;
  font-weight: 400;
}
.gp__panel input[type='range'] {
  width: 100%;
  accent-color: rgb(var(--fui-theme-primary));
}
.gp__profile select {
  padding: 6px 8px;
  border-radius: var(--fui-radius-sm);
  border: 1px solid rgba(var(--fui-border-color), 0.2);
  background: rgb(var(--fui-theme-surface));
  color: inherit;
}
.gp__copy {
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
