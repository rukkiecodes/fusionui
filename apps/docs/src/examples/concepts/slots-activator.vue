<script setup>
import { ref } from 'vue'

const dialog = ref(false)
</script>

<template>
  <div class="row">
    <!-- FMenu: the activator slot hands you the props to bind, plus isActive. -->
    <f-menu>
      <template #activator="{ props, isActive }">
        <f-btn
          v-bind="props"
          variant="outlined"
          :append-icon="isActive ? 'chevron-up' : 'chevron-down'"
        >
          Menu
        </f-btn>
      </template>

      <template #default="{ close }">
        <button class="item" @click="close">Rename</button>
        <button class="item" @click="close">Duplicate</button>
      </template>
    </f-menu>

    <!-- FTooltip: the activator slot receives the open state; it has no props to bind. -->
    <f-tooltip text="Copied to your clipboard">
      <template #activator="{ active }">
        <f-btn variant="tonal" :color="active ? 'success' : 'primary'">Tooltip</f-btn>
      </template>
    </f-tooltip>

    <!-- FDialog has no activator slot: open it from your own button through v-model. -->
    <f-btn variant="tonal" @click="dialog = true">Dialog</f-btn>
    <f-dialog v-model="dialog">
      <template #header><h3>No activator here</h3></template>
      <p>
        FDialog is driven entirely by <code>v-model</code>. Any control can open it, from anywhere
        in the tree — a row action, a keyboard shortcut, a router guard.
      </p>
      <template #footer>
        <f-btn variant="text" @click="dialog = false">Close</f-btn>
      </template>
    </f-dialog>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  border-radius: var(--fui-radius-sm);
  cursor: pointer;
}
.item:hover {
  background: rgba(var(--fui-theme-on-background), 0.06);
}
h3 {
  margin: 0;
  font-size: 1rem;
}
p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}
code {
  font-family: var(--fui-font-family-mono, monospace);
}
</style>
