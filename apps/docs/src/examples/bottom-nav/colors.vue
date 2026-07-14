<script setup lang="ts">
import { ref } from 'vue'

const a = ref('activity')
const b = ref('stats')
</script>

<template>
  <div class="stack">
    <f-bottom-nav v-model="a" color="success" grow mandatory>
      <f-bottom-nav-item value="activity" icon="activity" text="Activity" />
      <f-bottom-nav-item value="goals" icon="flag" text="Goals" />
      <f-bottom-nav-item value="you" icon="user" text="You" />
    </f-bottom-nav>

    <f-bottom-nav v-model="b" color="#6d28d9" :height="64" grow mandatory>
      <f-bottom-nav-item value="stats" icon="pie-chart" text="Stats" />
      <f-bottom-nav-item value="reports" icon="file-text" text="Reports" />
      <f-bottom-nav-item value="alerts" icon="bell" text="Alerts" disabled />
    </f-bottom-nav>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}
.stack > * {
  overflow: hidden;
  border-radius: var(--fui-radius-lg);
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
}
</style>
