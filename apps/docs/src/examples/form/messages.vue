<script setup lang="ts">
import { ref } from 'vue'

const taken = ref('ada')
const available = ref('ada-lovelace')
</script>

<template>
  <div class="w">
    <f-input
      v-model="taken"
      label="Username"
      :error-messages="['That username is already taken']"
    />
    <f-input v-model="available" label="Username" :success-messages="['Nice — that one is free']" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
