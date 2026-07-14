<script setup>
import { ref } from 'vue'

const variant = ref('tonal')
const variants = ['elevated', 'flat', 'tonal', 'outlined']
</script>

<template>
  <div class="wrap">
    <f-btn-group v-model="variant">
      <f-btn v-for="v in variants" :key="v" :value="v" variant="text" size="small">{{ v }}</f-btn>
    </f-btn-group>

    <div class="row">
      <f-btn :variant="variant" color="primary">FBtn</f-btn>
      <f-icon-btn :variant="variant" color="primary" icon="heart" aria-label="Like" />
      <f-chip :variant="variant" color="primary">FChip</f-chip>
      <f-fab :variant="variant" color="primary" icon="plus" />
    </div>

    <p class="note">
      One <code>variant</code> value, four components — the treatment is defined once, in the
      variant system, not per component.
    </p>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.note {
  margin: 0;
  font-size: 0.85rem;
  text-align: center;
  opacity: 0.65;
}
.note code {
  font-family: var(--fui-font-family-mono, monospace);
}
</style>
