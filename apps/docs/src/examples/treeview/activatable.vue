<script setup>
import { computed, ref } from 'vue'

const items = [
  {
    value: 'inbox',
    title: 'Inbox',
    children: [
      { value: 'inbox/starred', title: 'Starred' },
      { value: 'inbox/snoozed', title: 'Snoozed' },
    ],
  },
  {
    value: 'projects',
    title: 'Projects',
    children: [
      { value: 'projects/fusionui', title: 'FusionUI' },
      { value: 'projects/northwind', title: 'Northwind migration' },
      { value: 'projects/atlas', title: 'Atlas rewrite' },
    ],
  },
  { value: 'archive', title: 'Archive' },
]

const activated = ref(['projects/fusionui'])
const current = computed(() => activated.value[0] ?? 'nothing')

// `click:activate` gives you `{ id, value, item }` — the raw item included.
const lastEvent = ref('')
function onActivate({ id, value }) {
  lastEvent.value = `${value ? 'activated' : 'deactivated'} ${id}`
}
</script>

<template>
  <div class="w">
    <!-- Activatable: the row click selects, the chevron still opens the branch. -->
    <f-treeview
      v-model:activated="activated"
      activatable
      color="primary"
      :items="items"
      :opened="['projects']"
      @click:activate="onActivate"
    />
    <p class="state">Showing: {{ current }}</p>
    <p v-if="lastEvent" class="state">Last event: {{ lastEvent }}</p>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  text-align: start;
}

.state {
  margin-top: 12px;
  font-size: 0.8125rem;
  opacity: 0.7;
}
</style>
