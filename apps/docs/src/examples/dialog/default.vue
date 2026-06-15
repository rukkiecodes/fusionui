<script setup>
import { ref } from 'vue'
const open = ref(false)
const email = ref('')
const password = ref('')
const remember = ref(false)
</script>

<template>
  <f-btn @click="open = true">Open dialog</f-btn>

  <f-dialog v-model="open">
    <template #header>
      <h4 class="dlg-title">Welcome to <strong>FusionUI</strong></h4>
    </template>

    <div class="dlg-form">
      <f-input v-model="email" block placeholder="Email" prepend-icon="at-sign" />
      <f-input
        v-model="password"
        block
        type="password"
        placeholder="Password"
        prepend-icon="lock"
      />

      <div class="dlg-row">
        <f-checkbox v-model="remember">Remember me</f-checkbox>
        <a href="#" class="dlg-link">Forgot Password?</a>
      </div>

      <f-btn block color="primary" @click="open = false">Sign In</f-btn>
    </div>

    <template #footer>
      <p class="dlg-footer">New Here? <a href="#" class="dlg-link">Create New Account</a></p>
    </template>
  </f-dialog>
</template>

<style scoped>
.dlg-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 500;
}
.dlg-title strong {
  font-weight: 700;
}
.dlg-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 320px;
}
.dlg-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dlg-link {
  color: rgb(var(--fui-theme-primary));
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
}
.dlg-link:hover {
  text-decoration: underline;
}
.dlg-footer {
  width: 100%;
  margin: 0;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.85;
}
</style>
