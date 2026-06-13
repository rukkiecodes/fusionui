<script setup>
import { ref } from 'vue'
const name = ref('')
const pass = ref('')
const addr = ref('')
</script>

<template>
  <div style="display: flex; gap: 18px 16px; flex-wrap: wrap; justify-content: center">
    <f-input v-model="name" variant="shadow" placeholder="Name" />
    <f-input
      v-model="pass"
      type="password"
      variant="shadow"
      placeholder="Password"
      prepend-icon="lock"
    />
    <f-input v-model="addr" variant="shadow" placeholder="Address" append-icon="map-pin" />
  </div>
</template>
