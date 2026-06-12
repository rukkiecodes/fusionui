<script setup>
import { ref } from 'vue'
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
const v4 = ref('')
const v5 = ref('')
</script>

<template>
  <div style="display: flex; gap: 22px 16px; flex-wrap: wrap; justify-content: center">
    <vd-input v-model="v1" state="primary" placeholder="Primary" />
    <vd-input v-model="v2" state="success" placeholder="Success Icon" prepend-icon="user" />
    <vd-input v-model="v3" state="danger" placeholder="Danger icon after" append-icon="send" />
    <vd-input v-model="v4" state="warning" placeholder="Label Warn" label="Warn" />
    <vd-input v-model="v5" color="dark" state="primary" placeholder="Dark" style="display: none" />
    <vd-input v-model="v5" state="dark" placeholder="Dark" />
  </div>
</template>
