<template>
  <div class="stack">
    <div class="row">
      <input id="notify" type="checkbox" checked />
      <f-label for="notify" clickable text="Email me when a release ships" />
    </div>

    <div class="row">
      <input id="beta" type="checkbox" disabled />
      <f-label for="beta" disabled text="Join the beta channel (team plan only)" />
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
