<script setup>
import { ref } from 'vue'
const user = ref('')
const pass = ref('')
</script>

<template>
  <div style="display: flex; gap: 18px; flex-wrap: wrap; justify-content: center">
    <f-input v-model="user" placeholder="User name" prepend-icon="user" />
    <f-input v-model="pass" type="password" placeholder="Password" append-icon="lock" />
  </div>
</template>
