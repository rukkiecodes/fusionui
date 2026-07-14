<template>
  <div class="rows">
    <div class="row">
      <span>Open the command palette</span>
      <f-kbd keys="ctrl+k" />
    </div>
    <div class="row">
      <span>Save the document</span>
      <f-kbd keys="cmd+s" />
    </div>
    <div class="row">
      <span>Reopen the last closed tab</span>
      <f-kbd keys="ctrl+shift+t" />
    </div>
    <div class="row">
      <span>Move focus to the sidebar</span>
      <f-kbd :keys="['Alt', 'Left']" />
    </div>
  </div>
</template>

<style scoped>
.rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 340px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.9375rem;
}
</style>
