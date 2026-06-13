<script setup lang="ts">
import { ref } from 'vue'

// A phone mockup mirroring the Expo starter (App.tsx). The docs site is a Vue
// app and can't run React Native, but the native components share the very same
// tokens and contracts as their web siblings — so this token-driven preview shows
// exactly how @fusionui/native looks on a device.
const count = ref(0)
const on = ref(true)
const email = ref('')
</script>

<template>
  <div class="np">
    <div class="np__phone" :class="{ 'np__phone--dark': false }">
      <div class="np__notch" />
      <!-- App bar (the FShell navbar — the brighter shell frame) -->
      <div class="np__bar">
        <f-icon icon="feather" color="primary" />
        <strong>FusionUI</strong>
      </div>
      <!-- Recessed content that nestles under the bar (the FShell goo corner) -->
      <div class="np__screen">
        <f-card class="np__card">
          <div class="np__stack">
            <f-input v-model="email" label="Email" placeholder="you@example.com" />
            <f-btn block color="primary" @click="count++">Clicked {{ count }}×</f-btn>
            <div class="np__row">
              <f-switch v-model="on" />
              <span>Notifications</span>
            </div>
          </div>
        </f-card>

        <div class="np__glassbed">
          <f-glass :radius="18" :depth="14" class="np__glass">
            <strong>Liquid glass</strong>
          </f-glass>
        </div>
      </div>
    </div>

    <p class="np__caption">
      A token-driven preview of <code>@fusionui/native</code> — the real RN components
      (<code>FShell</code>, <code>FButton</code>, <code>FInput</code>, <code>FSwitch</code>,
      <code>FCard</code>, <code>LiquidGlassView</code>) render identically on a device, since they
      share these tokens.
    </p>
  </div>
</template>

<style scoped>
.np {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
}
.np__phone {
  position: relative;
  width: 300px;
  height: 600px;
  border-radius: 40px;
  padding: 10px;
  background: #0c0d10;
  box-shadow:
    0 30px 60px -20px rgba(15, 25, 60, 0.45),
    0 0 0 2px rgba(var(--fui-border-color), 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.np__notch {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 22px;
  border-radius: 12px;
  background: #0c0d10;
  z-index: 3;
}
.np__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 64px;
  padding: 18px 18px 0;
  font-weight: 600;
  font-size: 1.05rem;
  background: rgb(var(--fui-theme-surface));
  color: rgb(var(--fui-theme-on-surface));
  border-radius: 32px 32px 0 0;
}
.np__screen {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* recessed surface that nestles under the bar — the FShell content */
  background: rgb(var(--fui-surface-2));
  border-radius: 18px 18px 30px 30px;
}
.np__card {
  padding: 16px;
}
.np__stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.np__row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.92rem;
}
.np__glassbed {
  position: relative;
  height: 130px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(120deg, #195bff, #7d33ff 60%, #ff4757);
}
.np__glass {
  position: absolute;
  inset: 22px;
  display: grid;
  place-items: center;
  color: #fff;
}
.np__caption {
  max-width: 360px;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
