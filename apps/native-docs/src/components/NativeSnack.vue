<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTheme } from '@rukkiecodes/vue'
import { scheduleSnackEmbed } from './snackEmbed'

const props = withDefaults(defineProps<{ name: string; height?: number; deps?: string }>(), {
  height: 560,
  deps: '',
})

// Every generated snack, as raw text. Snack can't import the source-shipped
// @rukkiecodes/native, so each file is a self-contained, pure-RN mirror that inlines
// the @rukkiecodes/tokens values — composed by scripts/gen-snacks.mjs and keyed here
// by "<component>.<variant>" (e.g. switch.basic, button.gradient).
const sources = import.meta.glob('../../snacks/gen/*.js', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>

const theme = useTheme()
const encoded = computed(() =>
  encodeURIComponent(sources[`../../snacks/gen/${props.name}.js`] ?? '')
)
const snackTheme = computed(() => (theme.isDark.value ? 'dark' : 'light'))

onMounted(scheduleSnackEmbed)
</script>

<template>
  <div class="snack">
    <div
      class="snack__embed"
      :style="{ height: `${height}px` }"
      :data-snack-code="encoded"
      :data-snack-dependencies="deps"
      :data-snack-name="`FusionUI — ${name}`"
      data-snack-description="A @rukkiecodes/native component, running live."
      data-snack-platform="web"
      data-snack-supportedplatforms="web,mydevice,ios,android"
      data-snack-preview="true"
      data-snack-loading="lazy"
      :data-snack-theme="snackTheme"
    />
  </div>
</template>

<style scoped>
.snack {
  margin: 14px 0 8px;
}
.snack__embed {
  width: 100%;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  overflow: hidden;
  background: rgb(var(--fui-surface-2));
}
</style>
