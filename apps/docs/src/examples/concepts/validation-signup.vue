<script setup>
import { ref, watch } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const plan = ref(null)
const terms = ref(false)

const plans = ['Starter', 'Team', 'Enterprise']

const required = field => v => !!String(v ?? '').trim() || `${field} is required`
const isEmail = v =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v ?? '')) || 'Enter a valid email address'
const minChars = n => v => String(v ?? '').length >= n || `Use at least ${n} characters`
const hasDigit = v => /\d/.test(String(v ?? '')) || 'Include at least one number'

const nameRules = [required('Your name')]
const emailRules = [required('An email address'), isEmail]
const passwordRules = [required('A password'), minChars(8), hasDigit]
const planRules = [required('A plan')]

// A verdict that no rule can reach: it comes back from the server.
const TAKEN = 'taken@fusionui.dev'
const emailErrors = ref([])
const submitting = ref(false)
const created = ref(false)

// Clear the server's verdict as soon as the value it judged changes.
watch(email, () => {
  emailErrors.value = []
})

// FForm only emits `submit` once every registered field passes, so by the time
// this runs the client-side rules are already satisfied.
async function onSubmit() {
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 700))
  submitting.value = false

  if (email.value.trim().toLowerCase() === TAKEN) {
    emailErrors.value = ['That email is already registered']
    return
  }
  created.value = true
}

function clear(resetValidation) {
  name.value = ''
  email.value = ''
  password.value = ''
  plan.value = null
  terms.value = false
  emailErrors.value = []
  created.value = false
  resetValidation()
}
</script>

<template>
  <f-form v-slot="{ isValid, resetValidation }" class="form" @submit="onSubmit">
    <f-input v-model="name" label="Full name" prepend-icon="user" :rules="nameRules" />

    <f-input
      v-model="email"
      type="email"
      label="Work email"
      prepend-icon="mail"
      :rules="emailRules"
      :error-messages="emailErrors"
      validate-on="blur"
      hint="Try taken@fusionui.dev to see a server-side error"
      persistent-hint
    />

    <f-input
      v-model="password"
      type="password"
      label="Password"
      prepend-icon="lock"
      :rules="passwordRules"
      validate-on="blur"
    />

    <f-select v-model="plan" :items="plans" label="Plan" :rules="planRules" />

    <f-checkbox v-model="terms">I accept the terms</f-checkbox>

    <div class="actions">
      <f-btn
        type="submit"
        color="primary"
        :loading="submitting"
        :disabled="isValid === false || !terms"
      >
        Create account
      </f-btn>
      <f-btn type="button" variant="text" @click="clear(resetValidation)">Reset</f-btn>
    </div>

    <p v-if="created" class="ok">
      <f-icon icon="check-circle" size="small" />
      Account created — check your inbox to confirm your address.
    </p>
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
  gap: 10px;
  margin-top: 14px;
}
.ok {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0 0;
  font-size: 0.9rem;
  color: rgb(var(--fui-theme-success));
}
</style>
