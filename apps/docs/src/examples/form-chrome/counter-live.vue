<script setup lang="ts">
import { ref } from 'vue'

const bio = ref('Design engineer. I make interfaces that feel like objects.')
const focused = ref(false)
</script>

<template>
  <div class="stack">
    <f-label for="bio" text="Bio" />
    <input
      id="bio"
      v-model="bio"
      class="box"
      placeholder="Tell people what you do"
      @focus="focused = true"
      @blur="focused = false"
    />
    <div class="foot">
      <f-messages active messages="Shown on your public profile." />
      <f-counter :value="bio.length" :max="80" :active="focused" />
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 360px;
}

.box {
  width: 100%;
  padding: 9px 11px;
  font: inherit;
  font-size: 0.83rem;
  color: rgba(var(--fui-theme-on-surface), 0.9);
  background: rgb(var(--fui-surface-2));
  border: 2px solid transparent;
  border-radius: var(--fui-radius-md);
  outline: none;
}

.box:focus {
  background: rgb(var(--fui-surface-3));
}

.foot {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
</style>
