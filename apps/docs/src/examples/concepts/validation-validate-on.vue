<script setup>
import { ref } from 'vue'

const handle = ref('')
const website = ref('')
const invite = ref('')

const required = v => !!String(v ?? '').trim() || 'This field is required'
const rules = [required]
</script>

<template>
  <f-form v-slot="{ isValid }" class="form">
    <f-input
      v-model="handle"
      label="input — on every keystroke"
      :rules="rules"
      validate-on="input"
    />
    <f-input v-model="website" label="blur — when focus leaves" :rules="rules" validate-on="blur" />
    <f-input
      v-model="invite"
      label="submit — only when the form validates"
      :rules="rules"
      validate-on="submit"
    />

    <div class="actions">
      <f-btn type="submit" color="primary">Validate</f-btn>
      <span class="state">
        form isValid: <code>{{ String(isValid) }}</code>
      </span>
    </div>
  </f-form>
</template>

<style scoped>
.form {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
}
.state {
  font-size: 0.85rem;
  opacity: 0.75;
}
code {
  font-family: var(--fui-font-family-mono, monospace);
}
</style>
