<script setup lang="ts">
import { computed, ref } from 'vue'

const email = ref('ada@')

const errors = computed(() => {
  const value = email.value.trim()
  const out: string[] = []
  if (!value) out.push('An email address is required.')
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) out.push('Enter a valid email address.')
  return out
})
</script>

<template>
  <div class="stack">
    <f-label for="invite-email" text="Invite a teammate" />
    <input id="invite-email" v-model="email" class="box" placeholder="ada@example.com" />
    <f-messages :messages="errors" :active="errors.length > 0" color="danger" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 320px;
}

.box {
  width: 100%;
  padding: 9px 11px;
  font: inherit;
  font-size: 0.83rem;
  color: rgba(var(--fui-theme-on-surface), 0.9);
  background: rgb(var(--fui-surface-2));
  border: 2px solid transparent;
  border-radius: var(--fui-radius-md);
  outline: none;
}

.box:focus {
  background: rgb(var(--fui-surface-3));
}
</style>
