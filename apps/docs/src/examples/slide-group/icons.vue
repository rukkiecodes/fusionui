<script setup lang="ts">
import { ref } from 'vue'

const view = ref('overview')

const views = [
  { value: 'overview', label: 'Overview', icon: 'home' },
  { value: 'deployments', label: 'Deployments', icon: 'rocket' },
  { value: 'analytics', label: 'Analytics', icon: 'bar-chart' },
  { value: 'logs', label: 'Logs', icon: 'file-text' },
  { value: 'storage', label: 'Storage', icon: 'database' },
  { value: 'team', label: 'Team', icon: 'users' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <f-slide-group v-model="view" mandatory class="rail">
    <f-slide-group-item
      v-for="item in views"
      :key="item.value"
      :value="item.value"
      :icon="item.icon"
      :text="item.label"
    />
  </f-slide-group>
</template>

<style scoped>
.rail {
  width: 100%;
  min-width: 0;
}
</style>
