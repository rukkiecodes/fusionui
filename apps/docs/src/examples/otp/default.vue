<script setup>
import { ref } from 'vue'
const code = ref('')
const message = ref('')
function onComplete(v) {
  message.value = `Verifying ${v}…`
}
</script>

<template>
  <div class="col">
    <f-otp v-model="code" :length="6" @complete="onComplete" />
    <p class="msg">
      {{ message || 'Type a 6-digit code — it auto-advances, and paste fills all.' }}
    </p>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.msg {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.65;
}
</style>
