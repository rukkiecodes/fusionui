<template>
  <f-bottom-sheet>
    <template #activator="{ props: activator }">
      <f-btn v-bind="activator" color="primary" prepend-icon="share-2">Share this photo</f-btn>
    </template>

    <template #default="{ close }">
      <h4 class="sheet__title">Share</h4>

      <div class="sheet__grid">
        <button class="sheet__action" @click="close">
          <f-icon icon="link" />
          Copy link
        </button>
        <button class="sheet__action" @click="close">
          <f-icon icon="mail" />
          Email
        </button>
        <button class="sheet__action" @click="close">
          <f-icon icon="download" />
          Save
        </button>
        <button class="sheet__action" @click="close">
          <f-icon icon="printer" />
          Print
        </button>
      </div>
    </template>
  </f-bottom-sheet>
</template>

<style scoped>
.sheet__title {
  margin: 0 0 14px;
  font-size: 1.05rem;
  font-weight: 600;
}
.sheet__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.sheet__action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 6px;
  border: 0;
  border-radius: var(--fui-radius-md);
  background: rgba(var(--fui-theme-on-surface), 0.05);
  color: inherit;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}
.sheet__action:hover {
  background: rgba(var(--fui-theme-on-surface), 0.1);
}
</style>
