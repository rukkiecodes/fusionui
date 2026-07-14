<template>
  <div class="stack">
    <f-label for="release-notes" text="Release notes" />
    <textarea id="release-notes" class="box" rows="3" placeholder="What changed in this version?" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 320px;
}

.box {
  width: 100%;
  padding: 9px 11px;
  font: inherit;
  font-size: 0.83rem;
  color: rgba(var(--fui-theme-on-surface), 0.9);
  background: rgb(var(--fui-surface-2));
  border: 2px solid transparent;
  border-radius: var(--fui-radius-md);
  outline: none;
  resize: vertical;
}

.box:focus {
  background: rgb(var(--fui-surface-3));
}
</style>
