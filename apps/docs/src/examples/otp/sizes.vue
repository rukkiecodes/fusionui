<script setup>
import { ref } from 'vue'
const a = ref('')
const b = ref('')
const c = ref('')
</script>

<template>
  <div class="col">
    <f-otp v-model="a" :length="4" size="small" />
    <f-otp v-model="b" :length="4" />
    <f-otp v-model="c" :length="4" size="large" />
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
</style>
