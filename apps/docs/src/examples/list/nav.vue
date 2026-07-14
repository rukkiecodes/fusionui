<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { icon: 'home', title: 'Overview' },
  { icon: 'bar-chart-2', title: 'Analytics' },
  { icon: 'users', title: 'Customers' },
  { icon: 'settings', title: 'Settings' },
]
const current = ref('Overview')
</script>

<template>
  <div class="w">
    <f-list nav>
      <f-list-item
        v-for="item in items"
        :key="item.title"
        link
        :active="current === item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        @click="current = item.title"
      />
    </f-list>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}
</style>
