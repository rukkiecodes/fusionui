<script setup>
import { ref } from 'vue'
const email = ref('not-an-email')
const name = ref('Ada Lovelace')
const emailRules = [v => (typeof v === 'string' && v.includes('@')) || 'Enter a valid email']
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px">
    <vd-input v-model="email" label="Email" label-placeholder :rules="emailRules" />
    <vd-input v-model="name" label="Name" label-placeholder :success-messages="['Looks good!']" />
    <vd-input label="Hint" label-placeholder hint="We never share your data." persistent-hint />
  </div>
</template>
