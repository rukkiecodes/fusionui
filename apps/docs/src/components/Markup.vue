<script setup lang="ts">
import { computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'

const props = defineProps<{ code: string; lang?: string }>()

const lang = computed(() => props.lang ?? 'markup')
// Prism's markup grammar highlights embedded <script> as JS (prism-javascript
// is loaded), so a whole .vue block renders with both HTML and JS colors.
const html = computed(() =>
  Prism.highlight(props.code, Prism.languages[lang.value] ?? Prism.languages.markup, lang.value)
)
</script>

<template>
  <pre class="markup" :class="`language-${lang}`"><code v-html="html"></code></pre>
</template>
