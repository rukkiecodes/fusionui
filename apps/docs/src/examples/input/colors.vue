<script setup>
import { ref } from 'vue'
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
const v4 = ref('')
const v5 = ref('')
const v6 = ref('')
const v7 = ref('')
</script>

<template>
  <div class="color-grid">
    <f-input v-model="v1" color="primary" placeholder="Primary" />
    <f-input v-model="v2" color="success" placeholder="Success Icon" prepend-icon="user" />
    <f-input v-model="v3" color="danger" placeholder="Danger icon after" append-icon="send" />
    <f-input v-model="v4" color="warning" placeholder="Label Warn" label="Warn" />
    <f-input v-model="v5" color="dark" label="Dark" label-placeholder />
    <f-input v-model="v6" color="#7d33ff" placeholder="HEX" />
    <f-input v-model="v7" color="rgb(59,222,200)" placeholder="RGB" />
  </div>
</template>

<style scoped>
.color-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px 18px;
  max-width: 700px;
}
</style>
