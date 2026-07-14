<script setup>
import { ref } from 'vue'

const enabled = ref(true)
</script>

<template>
  <div class="wrap">
    <div class="tiles">
      <!-- Bare directive: enabled, ripples from the pointer. -->
      <div v-ripple class="tile">
        <f-icon icon="image" />
        <span>v-ripple</span>
      </div>

      <!-- .center: the circle always starts from the middle of the element. -->
      <div v-ripple.center class="tile">
        <f-icon icon="crosshair" />
        <span>v-ripple.center</span>
      </div>

      <!-- The value toggles it at runtime. -->
      <div v-ripple="enabled" class="tile">
        <f-icon :icon="enabled ? 'zap' : 'zap-off'" />
        <span>v-ripple="enabled"</span>
      </div>

      <!-- The ink colour is a CSS variable: an r,g,b triplet, or a theme one. -->
      <div v-ripple class="tile tile--tinted">
        <f-icon icon="droplet" />
        <span>--fui-ripple-color</span>
      </div>
    </div>

    <f-switch v-model="enabled">Ripple enabled</f-switch>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.tiles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 150px;
  height: 96px;
  border-radius: var(--fui-radius-md);
  background: rgb(var(--fui-theme-primary));
  color: rgb(var(--fui-theme-on-primary));
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.75rem;
  cursor: pointer;
  user-select: none;
}
/* The default ink is white; components point it at their own accent instead. */
.tile--tinted {
  background: rgba(var(--fui-theme-on-background), 0.06);
  color: rgb(var(--fui-theme-on-background));
  --fui-ripple-color: var(--fui-theme-danger);
}
</style>
