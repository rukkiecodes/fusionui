<script setup lang="ts">
const timezones = [
  'Pacific/Auckland',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Europe/Moscow',
  'Africa/Nairobi',
  'Africa/Lagos',
  'Europe/Berlin',
  'Europe/London',
  'Atlantic/Reykjavik',
  'America/Sao_Paulo',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Pacific/Honolulu',
]
</script>

<template>
  <f-bottom-sheet scrollable>
    <template #activator="{ props: activator }">
      <f-btn v-bind="activator" variant="outlined" prepend-icon="clock">Change timezone</f-btn>
    </template>

    <template #default="{ close }">
      <h4 class="sheet__title">Timezone</h4>

      <ul class="sheet__list">
        <li v-for="zone in timezones" :key="zone">
          <button class="sheet__row" @click="close">{{ zone }}</button>
        </li>
      </ul>
    </template>
  </f-bottom-sheet>
</template>

<style scoped>
.sheet__title {
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 600;
}
.sheet__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.sheet__row {
  width: 100%;
  padding: 12px 10px;
  border: 0;
  border-radius: var(--fui-radius-sm);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.sheet__row:hover {
  background: rgba(var(--fui-theme-on-surface), 0.06);
}
</style>
