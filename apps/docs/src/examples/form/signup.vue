<script setup lang="ts">
import { ref } from 'vue'

type Rule = (value: unknown) => boolean | string

const name = ref('')
const email = ref('')
const password = ref('')
const submitted = ref(false)

const required =
  (field: string): Rule =>
  v =>
    !!String(v ?? '').trim() || `${field} is required`

const isEmail: Rule = v =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v ?? '')) || 'Enter a valid email address'

const minChars =
  (n: number): Rule =>
  v =>
    String(v ?? '').length >= n || `Use at least ${n} characters`

const nameRules = [required('Full name')]
const emailRules = [required('Work email'), isEmail]
const passwordRules = [required('Password'), minChars(8)]

function onSubmit() {
  submitted.value = true
}

function clear(resetValidation: () => void) {
  name.value = ''
  email.value = ''
  password.value = ''
  submitted.value = false
  resetValidation()
}
</script>

<template>
  <f-form v-slot="{ isValid, reset }" class="signup" @submit="onSubmit">
    <f-input v-model="name" label="Full name" prepend-icon="user" :rules="nameRules" />
    <f-input
      v-model="email"
      type="email"
      label="Work email"
      prepend-icon="mail"
      :rules="emailRules"
      validate-on="blur"
    />
    <f-input
      v-model="password"
      type="password"
      label="Password"
      prepend-icon="lock"
      hint="At least 8 characters"
      persistent-hint
      :rules="passwordRules"
    />

    <div class="actions">
      <f-btn type="submit" color="primary" :disabled="isValid === false">Create account</f-btn>
      <f-btn type="button" variant="text" @click="clear(reset)">Reset</f-btn>
    </div>

    <p v-if="submitted" class="ok">
      <f-icon icon="check-circle" size="small" />
      Account created — check your inbox to confirm your address.
    </p>
  </f-form>
</template>

<style scoped>
.signup {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.ok {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: rgb(var(--fui-theme-success));
}
</style>
