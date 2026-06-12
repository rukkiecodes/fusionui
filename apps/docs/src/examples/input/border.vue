<script setup>
import { ref } from 'vue'
const name = ref('')
const pass = ref('')
const addr = ref('')
</script>

<template>
  <div style="display: flex; gap: 18px 16px; flex-wrap: wrap; justify-content: center">
    <vd-input v-model="name" variant="underlined" placeholder="Name" />
    <vd-input
      v-model="pass"
      type="password"
      variant="underlined"
      placeholder="Password"
      prepend-icon="lock"
    />
    <vd-input v-model="addr" variant="underlined" placeholder="Address" append-icon="map-pin" />
  </div>
</template>
