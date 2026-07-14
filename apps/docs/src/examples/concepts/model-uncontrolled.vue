<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div class="cols">
    <div class="col">
      <span class="head">No v-model</span>
      <!-- Nothing is bound, so the menu keeps its own open state internally. -->
      <f-menu>
        <template #activator="{ props }">
          <f-btn v-bind="props" variant="outlined">Uncontrolled</f-btn>
        </template>
        <p class="panel">The component owns the state.</p>
      </f-menu>
      <p class="note">Fine when nothing else needs to know.</p>
    </div>

    <div class="col">
      <span class="head">v-model="open"</span>
      <!-- Bound, so the parent ref is the single source of truth. -->
      <f-menu v-model="open">
        <template #activator="{ props }">
          <f-btn v-bind="props" variant="outlined">Controlled</f-btn>
        </template>
        <p class="panel">The parent owns the state.</p>
      </f-menu>
      <p class="note">
        open is <code>{{ open }}</code> —
        <button class="link" @click="open = !open">toggle it from out here</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.cols {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
}
.col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  max-width: 240px;
}
.head {
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.8rem;
  opacity: 0.6;
}
.panel {
  margin: 0;
  padding: 4px 8px;
  font-size: 0.85rem;
  white-space: nowrap;
}
.note {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.75;
}
.link {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: rgb(var(--fui-theme-primary));
  cursor: pointer;
  text-decoration: underline;
}
code {
  font-family: var(--fui-font-family-mono, monospace);
}
</style>
