<script setup>
import { ref } from 'vue'

const agree = ref(true)
const notifications = ref(false)
const plan = ref('pro')
const volume = ref(60)
const fruit = ref(null)
const items = [
  { title: 'Apple', value: 'apple' },
  { title: 'Banana', value: 'banana' },
  { title: 'Cherry', value: 'cherry' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px">
    <vd-checkbox v-model="agree" label="I agree to the terms" />
    <vd-switch v-model="notifications" label="Enable notifications" color="success" />
    <vd-radio-group v-model="plan" label="Plan" inline>
      <vd-radio :value="'free'" label="Free" />
      <vd-radio :value="'pro'" label="Pro" />
    </vd-radio-group>
    <vd-slider v-model="volume" color="primary" />
    <vd-select v-model="fruit" :items="items" label="Favourite fruit" clearable />
  </div>
</template>
