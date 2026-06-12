<script setup>
import { ref } from 'vue'
const user = ref('')
const pass = ref('')
</script>

<template>
  <div style="display: flex; gap: 18px; flex-wrap: wrap; justify-content: center">
    <vd-input v-model="user" placeholder="User name" prepend-icon="user" />
    <vd-input v-model="pass" type="password" placeholder="Password" append-icon="lock" />
  </div>
</template>
