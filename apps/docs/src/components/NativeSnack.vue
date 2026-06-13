<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useTheme } from '@fusionui/vue'
// The self-contained, runnable mirror of @fusionui/native (pure RN, no Skia — so
// it runs reliably in Snack's web player). Imported as raw text and handed to the
// Snack embed; @fusionui/native itself is unpublished, so the code is inlined.
import snackCode from '../snack/FusionUISnack.js?raw'

const theme = useTheme()
const host = ref<HTMLElement | null>(null)
const encoded = encodeURIComponent(snackCode)

// expo-snack's embed.js scans the DOM for [data-snack-code] elements and swaps
// them for an iframe player. Appending the script on mount re-runs that scan, so
// it works in this SPA (the div already exists when the script loads).
function runEmbed() {
  if (typeof document === 'undefined') return
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://snack.expo.dev/embed.js'
  document.body.appendChild(s)
}

onMounted(runEmbed)
// Re-running on theme change lets the player re-render in the matching theme.
watch(
  () => theme.isDark.value,
  () => runEmbed()
)
</script>

<template>
  <div class="snack">
    <div
      ref="host"
      class="snack__embed"
      :data-snack-code="encoded"
      data-snack-name="FusionUI on mobile"
      data-snack-description="The @fusionui/native components, running live."
      data-snack-platform="web"
      data-snack-supportedplatforms="web,mydevice,ios,android"
      data-snack-preview="true"
      data-snack-loading="lazy"
      :data-snack-theme="theme.isDark.value ? 'dark' : 'light'"
    />
    <p class="snack__note">
      Live in <a href="https://snack.expo.dev" target="_blank" rel="noopener">Expo Snack</a> — edit
      the code, or open it on your phone with the Expo Go app. The components are inlined here (pure
      React Native) so the Snack runs without publishing <code>@fusionui/native</code>; they read
      the same FusionUI tokens that ship in the package.
    </p>
  </div>
</template>

<style scoped>
.snack {
  margin: 20px 0;
}
.snack__embed {
  width: 100%;
  height: 560px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  overflow: hidden;
  background: rgb(var(--fui-surface-2));
}
.snack__note {
  margin-top: 10px;
  font-size: 0.85rem;
  opacity: 0.7;
}
.snack__note a {
  color: rgb(var(--fui-theme-primary));
}
</style>
