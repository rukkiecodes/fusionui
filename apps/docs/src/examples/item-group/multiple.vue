<script setup lang="ts">
import { ref } from 'vue'

const addons = ref(['analytics'])

const options = [
  { value: 'analytics', label: 'Analytics', icon: 'bar-chart' },
  { value: 'backups', label: 'Daily backups', icon: 'database' },
  { value: 'support', label: '24/7 support', icon: 'headphones' },
  { value: 'audit', label: 'Audit log', icon: 'file-text' },
]
</script>

<template>
  <div class="stack">
    <f-item-group v-model="addons" multiple :max="2">
      <f-item
        v-for="option in options"
        :key="option.value"
        v-slot="{ isSelected, selectedClass, toggle }"
        :value="option.value"
      >
        <f-sheet
          tag="button"
          type="button"
          border
          rounded
          class="addon"
          :class="selectedClass"
          @click="toggle"
        >
          <f-icon :icon="option.icon" size="small" :color="isSelected ? 'primary' : undefined" />
          {{ option.label }}
        </f-sheet>
      </f-item>
    </f-item-group>

    <p class="state">{{ addons.length }} of 2 add-ons selected</p>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.addon {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.state {
  margin: 0;
  font-family: var(--fui-font-family-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
}
</style>
