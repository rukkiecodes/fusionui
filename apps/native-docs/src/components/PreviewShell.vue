<script setup lang="ts">
// The code-sample shell, in the spirit of reacticx: a toolbar with package-manager
// tabs (the `add` command) + a copy button, above a runnable preview card. The
// preview is a saved multi-file Expo Snack embedded by id — the default tab is the
// clean App demo, with the real component source one tab over.
import { computed, onMounted, ref } from 'vue'
import { useTheme } from '@rukkiecodes/vue'
import { scheduleSnackEmbed } from './snackEmbed'

const props = withDefaults(
  defineProps<{
    slug: string
    snackId?: string
    height?: number
    platform?: 'web' | 'mydevice'
  }>(),
  { snackId: undefined, height: 640, platform: 'web' }
)

const managers = [
  { id: 'npm', label: 'npm', run: 'npx' },
  { id: 'pnpm', label: 'pnpm', run: 'pnpm dlx' },
  { id: 'bun', label: 'bun', run: 'bunx' },
]
const selected = ref('npm')
const command = computed(() => {
  const m = managers.find(x => x.id === selected.value) ?? managers[0]
  return `${m.run} @rukkiecodes/native add ${props.slug}`
})

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(command.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* clipboard unavailable */
  }
}

const theme = useTheme()
const snackTheme = computed(() => (theme.isDark.value ? 'dark' : 'light'))

onMounted(scheduleSnackEmbed)
</script>

<template>
  <div class="shell">
    <div class="shell__bar">
      <div class="shell__tabs" role="tablist" aria-label="Package manager">
        <button
          v-for="m in managers"
          :key="m.id"
          role="tab"
          :aria-selected="selected === m.id"
          class="shell__tab"
          :class="{ 'shell__tab--on': selected === m.id }"
          @click="selected = m.id"
        >
          {{ m.label }}
        </button>
      </div>

      <code class="shell__cmd">{{ command }}</code>

      <button class="shell__copy" :aria-label="`Copy: ${command}`" @click="copy">
        <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>

    <p v-if="snackId && platform === 'mydevice'" class="shell__hint">
      <f-icon icon="smartphone" size="small" />
      This is a GPU (Skia) component — open it on your device (scan the QR, or press
      <em>My Device</em>) to see it run.
    </p>

    <div class="shell__preview" :style="{ height: `${height}px` }">
      <div
        v-if="snackId"
        class="shell__snack"
        :data-snack-id="snackId"
        data-snack-preview="true"
        :data-snack-platform="platform"
        data-snack-supportedplatforms="web,mydevice,ios,android"
        data-snack-loading="lazy"
        :data-snack-theme="snackTheme"
      />
      <div v-else class="shell__nopreview">
        <f-icon icon="smartphone" />
        <span>Add the component to run it in your Expo app.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shell {
  margin: 0 0 8px;
}
.shell__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.shell__tabs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  background: rgb(var(--fui-theme-surface));
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
}
.shell__tab {
  appearance: none;
  border: 0;
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 7px;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(var(--fui-theme-on-surface), 0.6);
  background: transparent;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.shell__tab--on {
  color: rgb(var(--fui-theme-primary));
  background: rgba(var(--fui-theme-primary), 0.12);
}
.shell__cmd {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border-radius: 9px;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  background: rgb(var(--fui-theme-surface));
  font-size: 0.86rem;
  white-space: nowrap;
  overflow-x: auto;
}
.shell__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 9px;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  background: rgb(var(--fui-theme-surface));
  color: rgb(var(--fui-theme-on-surface));
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.shell__copy:hover {
  border-color: rgba(var(--fui-theme-primary), 0.5);
}
.shell__hint {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: rgba(var(--fui-theme-on-surface), 0.6);
}
.shell__hint em {
  font-style: normal;
  font-weight: 600;
  color: rgba(var(--fui-theme-on-surface), 0.8);
}
.shell__preview {
  border-radius: var(--fui-radius-lg, 16px);
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.1);
  overflow: hidden;
  background: rgb(var(--fui-surface-2, var(--fui-theme-surface)));
}
.shell__snack {
  width: 100%;
  height: 100%;
}
.shell__nopreview {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(var(--fui-theme-on-surface), 0.5);
  font-size: 0.9rem;
}
</style>
