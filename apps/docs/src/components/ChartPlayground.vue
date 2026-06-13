<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { FLineChart } from '@fusionui/vue'

const series = [
  { x: 'Mon', y: 12 },
  { x: 'Tue', y: 19 },
  { x: 'Wed', y: 8 },
  { x: 'Thu', y: 22 },
  { x: 'Fri', y: 16 },
  { x: 'Sat', y: 27 },
  { x: 'Sun', y: 14 },
]

// Spiky data where a naive spline lies about the values.
const spiky = [
  { x: 'a', y: 0 },
  { x: 'b', y: 10 },
  { x: 'c', y: 0 },
  { x: 'd', y: 10 },
  { x: 'e', y: 0 },
]

const curveNames = ['monotone', 'linear', 'catmullRom', 'step', 'basis'] as const
const cfg = reactive({
  curve: 'monotone' as (typeof curveNames)[number],
  area: true,
})

const code = computed(
  () =>
    `<FLineChart :data="series" curve="${cfg.curve}"${cfg.area ? ' area' : ''} :tick-count="6" />`
)
const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="cp">
    <div class="cp__main">
      <FLineChart
        :data="series"
        :curve="cfg.curve"
        :area="cfg.area"
        :tick-count="6"
        style="width: 100%; height: 300px"
      />
    </div>
    <div class="cp__panel">
      <div class="cp__curves">
        <button
          v-for="c in curveNames"
          :key="c"
          class="cp__chip"
          :class="{ 'cp__chip--active': cfg.curve === c }"
          @click="cfg.curve = c"
        >
          {{ c }}
        </button>
      </div>
      <label class="cp__row"><input v-model="cfg.area" type="checkbox" /> Area fill</label>
      <button class="cp__copy" @click="copy">
        <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        {{ copied ? 'Copied' : 'Copy code' }}
      </button>
    </div>
  </div>

  <h3 class="cp__h">The honesty check</h3>
  <p class="cp__p">
    Same spiky data, two curves. <strong>monotone</strong> (Fritsch–Carlson) provably never draws a
    peak or valley that isn't in the data. <strong>catmullRom</strong> bulges past the points — it
    looks smoother and lies about the values.
  </p>
  <div class="cp__honesty">
    <figure>
      <FLineChart
        :data="spiky"
        curve="monotone"
        area
        :show-axes="false"
        style="width: 100%; height: 180px"
      />
      <figcaption>monotone — stays inside the data ✓</figcaption>
    </figure>
    <figure>
      <FLineChart
        :data="spiky"
        curve="catmullRom"
        area
        :show-axes="false"
        style="width: 100%; height: 180px"
      />
      <figcaption>catmullRom — overshoots ✗</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.cp {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 16px;
  margin: 16px 0;
}
@media (max-width: 720px) {
  .cp {
    grid-template-columns: 1fr;
  }
}
.cp__main {
  padding: 12px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
  overflow: hidden;
}
.cp__panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
}
.cp__curves {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cp__chip {
  padding: 5px 10px;
  border-radius: var(--fui-radius-pill);
  border: 1px solid rgba(var(--fui-border-color), 0.2);
  background: transparent;
  color: inherit;
  font-size: 12px;
  cursor: pointer;
}
.cp__chip--active {
  background: rgb(var(--fui-theme-primary));
  color: #fff;
  border-color: transparent;
}
.cp__row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
}
.cp__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  margin-top: auto;
  padding: 8px;
  border: none;
  border-radius: var(--fui-radius-sm);
  background: rgb(var(--fui-theme-primary));
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}
.cp__h {
  margin: 28px 0 4px;
}
.cp__p {
  margin: 0 0 12px;
  opacity: 0.8;
  font-size: 14px;
}
.cp__honesty {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 560px) {
  .cp__honesty {
    grid-template-columns: 1fr;
  }
}
.cp__honesty figure {
  margin: 0;
  padding: 12px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
  overflow: hidden;
}
.cp__honesty figcaption {
  margin-top: 6px;
  font-size: 12px;
  text-align: center;
  opacity: 0.7;
}
</style>
