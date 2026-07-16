<script setup lang="ts">
// Render a string with `backtick` spans as <code>, so registry prose can carry
// inline code without a full markdown pass.
import { computed } from 'vue'

const props = defineProps<{ text: string }>()

const parts = computed(() =>
  props.text.split('`').map((seg, i) => ({ code: i % 2 === 1, text: seg }))
)
</script>

<template>
  <span
    ><template v-for="(p, i) in parts" :key="i"
      ><code v-if="p.code">{{ p.text }}</code
      ><template v-else>{{ p.text }}</template></template
    ></span
  >
</template>
