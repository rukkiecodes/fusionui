<template>
  <div class="stack">
    <f-counter active :value="248" />
    <f-counter active :value="34" :max="60" />
    <f-counter active :value="71" :max="60" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
