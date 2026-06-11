<script setup lang="ts">
defineProps<{ code: string; lang?: string }>()
</script>

<template>
  <pre class="markup"><code>{{ code }}</code></pre>
</template>
