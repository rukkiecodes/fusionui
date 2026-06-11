<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const bio = ref('')
const required = [v => !!v || 'This field is required']
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px">
    <vd-input v-model="name" label="Name" label-placeholder prepend-icon="$edit" />
    <vd-input v-model="email" label="Email" type="email" :rules="required" clearable />
    <vd-textarea v-model="bio" label="Bio" hint="A short description" persistent-hint />
  </div>
</template>
