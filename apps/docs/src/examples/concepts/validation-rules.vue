<script setup>
import { ref } from 'vue'

const handle = ref('')

// Each rule gets the field's current value. `true` passes; a string is the
// message to show. Rules run in order and every failure is collected, but the
// field only ever renders the first one.
const rules = [
  v => !!String(v ?? '').trim() || 'A handle is required',
  v => String(v ?? '').length >= 3 || 'Use at least 3 characters',
  v => /^[a-z0-9-]+$/.test(String(v ?? '')) || 'Lowercase letters, numbers and dashes only',
]
</script>

<template>
  <div class="w">
    <f-input v-model="handle" label="Handle" prepend-icon="at-sign" :rules="rules" />
    <p class="hint">Try <code>Ab</code> — the length rule fails first, so that message wins.</p>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}
.hint {
  margin: 12px 0 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
code {
  font-family: var(--fui-font-family-mono, monospace);
}
</style>
