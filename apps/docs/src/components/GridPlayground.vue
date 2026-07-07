<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const densities = ['default', 'comfortable', 'compact']
const aligns = ['stretch', 'start', 'center', 'end', 'baseline']
const justifies = ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly']
const spanOptions = ['auto', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

const copied = ref(false)

const cfg = reactive({
  density: 'default',
  noGutters: false,
  align: 'stretch',
  justify: 'start',
  cols: ['4', '4', '4'] as string[],
})

const defaults = JSON.stringify(cfg)

function addCol() {
  if (cfg.cols.length < 12) cfg.cols.push('3')
}
function removeCol(i: number) {
  if (cfg.cols.length > 1) cfg.cols.splice(i, 1)
}

// Only emit attributes that differ from the component defaults, so the snippet
// stays copy-paste minimal.
const rowAttrs = computed(() => {
  const a: string[] = []
  if (cfg.noGutters) a.push('no-gutters')
  else if (cfg.density !== 'default') a.push(`density="${cfg.density}"`)
  if (cfg.align !== 'stretch') a.push(`align="${cfg.align}"`)
  if (cfg.justify !== 'start') a.push(`justify="${cfg.justify}"`)
  return a.length ? ' ' + a.join(' ') : ''
})

const code = computed(() => {
  const lines = [`<f-row${rowAttrs.value}>`]
  cfg.cols.forEach((c, i) => {
    lines.push(`  <f-col cols="${c}">${i + 1}</f-col>`)
  })
  lines.push('</f-row>')
  return lines.join('\n')
})

async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
function reset() {
  Object.assign(cfg, JSON.parse(defaults))
}
</script>

<template>
  <div class="pg">
    <div class="pg__bar">
      <div class="pg__tabs">
        <button
          v-for="d in densities"
          :key="d"
          class="pg__tab"
          :class="{ 'pg__tab--active': !cfg.noGutters && cfg.density === d }"
          @click="((cfg.density = d), (cfg.noGutters = false))"
        >
          {{ d }}
        </button>
        <button
          class="pg__tab"
          :class="{ 'pg__tab--active': cfg.noGutters }"
          @click="cfg.noGutters = true"
        >
          no-gutters
        </button>
      </div>
      <div class="pg__bar-actions">
        <button class="pg__icon" title="Reset" @click="reset">
          <f-icon icon="refresh-cw" size="small" />
        </button>
        <button class="pg__icon" title="Copy code" @click="copy">
          <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        </button>
      </div>
    </div>

    <div class="pg__body">
      <div class="pg__preview">
        <div class="grid-demo grid-demo--tall" style="width: 100%">
          <f-row
            :density="cfg.density"
            :no-gutters="cfg.noGutters"
            :align="cfg.align"
            :justify="cfg.justify"
            style="min-height: 130px"
          >
            <f-col v-for="(c, i) in cfg.cols" :key="i" :cols="c">
              <div class="grid-demo__cell">{{ i + 1 }}</div>
            </f-col>
          </f-row>
        </div>
      </div>

      <div class="pg__config">
        <p class="pg__config-title">Row</p>
        <f-select v-model="cfg.align" :items="aligns" label="align" />
        <f-select v-model="cfg.justify" :items="justifies" label="justify" />

        <p class="pg__config-title" style="margin-top: 18px">
          Columns
          <f-btn
            size="x-small"
            variant="outlined"
            prepend-icon="plus"
            :disabled="cfg.cols.length >= 12"
            @click="addCol"
          >
            add
          </f-btn>
        </p>
        <div v-for="(c, i) in cfg.cols" :key="i" class="pg-col-row">
          <f-select v-model="cfg.cols[i]" :items="spanOptions" :label="`col ${i + 1}`" />
          <button
            class="pg__icon"
            title="Remove column"
            :disabled="cfg.cols.length <= 1"
            @click="removeCol(i)"
          >
            <f-icon icon="trash-2" size="small" />
          </button>
        </div>
      </div>
    </div>

    <Markup :code="code" lang="markup" />
  </div>
</template>

<style scoped>
.pg-col-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.pg-col-row :deep(.fui-field) {
  flex: 1;
}
.pg__config-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
