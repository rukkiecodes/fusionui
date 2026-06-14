<script setup>
import { ref } from 'vue'
const plan = ref('pro')
</script>

<template>
  <div class="col">
    <f-radio-group v-model="plan" inline label="Plan">
      <f-radio value="free">Free</f-radio>
      <f-radio value="pro">Pro</f-radio>
      <f-radio value="team">Team</f-radio>
    </f-radio-group>
    <code>{{ plan }}</code>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
