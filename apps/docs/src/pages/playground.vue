<script setup lang="ts">
import { computed, reactive } from 'vue'

const state = reactive({
  text: 'Click me',
  variant: 'elevated',
  color: 'primary',
  size: 'default',
  rounded: false,
  loading: false,
  block: false,
})

const variants = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'gradient', 'relief', 'line']
const colors = ['primary', 'secondary', 'success', 'danger', 'warning']
const sizes = ['x-small', 'small', 'default', 'large', 'x-large']

const code = computed(
  () =>
    `<vd-btn\n  variant="${state.variant}"\n  color="${state.color}"\n  size="${state.size}"` +
    `${state.rounded ? '\n  rounded' : ''}${state.block ? '\n  block' : ''}` +
    `${state.loading ? '\n  loading' : ''}\n>\n  ${state.text}\n</vd-btn>`
)
</script>

<template>
  <div class="markdown-body">
    <h1>Playground</h1>
    <p>Tweak the controls and watch <code>VdBtn</code> update live.</p>

    <div class="example">
      <div class="example__preview" style="min-height: 120px; display: grid; place-items: center">
        <vd-btn
          :variant="state.variant"
          :color="state.color"
          :size="state.size"
          :rounded="state.rounded"
          :loading="state.loading"
          :block="state.block"
        >
          {{ state.text }}
        </vd-btn>
      </div>
      <Markup :code="code" />
    </div>

    <div style="display: grid; gap: 16px; grid-template-columns: repeat(2, 1fr); margin-top: 24px">
      <vd-input v-model="state.text" label="Text" label-placeholder />
      <vd-select v-model="state.variant" :items="variants" label="Variant" />
      <vd-select v-model="state.color" :items="colors" label="Color" />
      <vd-select v-model="state.size" :items="sizes" label="Size" />
      <vd-switch v-model="state.rounded" label="Rounded" />
      <vd-switch v-model="state.block" label="Block" />
      <vd-switch v-model="state.loading" label="Loading" />
    </div>
  </div>
</template>
