<script setup>
import { ref } from 'vue'
const ok = ref('1234')
const bad = ref('9999')
</script>

<template>
  <div class="col">
    <div class="line">
      <f-otp v-model="ok" :length="4" state="success" />
      <span class="msg msg--ok">Verified</span>
    </div>
    <div class="line">
      <f-otp v-model="bad" :length="4" state="danger" />
      <span class="msg msg--bad">Incorrect code</span>
    </div>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.line {
  display: flex;
  align-items: center;
  gap: 14px;
}
.msg {
  font-size: 0.85rem;
}
.msg--ok {
  color: rgb(var(--fui-theme-success));
}
.msg--bad {
  color: rgb(var(--fui-theme-danger));
}
</style>
