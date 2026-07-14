<template>
  <div class="row">
    <f-overlay scrim="rgba(20, 24, 60, 0.75)">
      <template #activator="{ props }">
        <f-btn v-bind="props">Tinted scrim</f-btn>
      </template>
      <template #default="{ close }">
        <div class="sheet">
          <p>A darker, cooler scrim — pass any CSS color to <code>scrim</code>.</p>
          <f-btn color="primary" size="small" @click="close">Close</f-btn>
        </div>
      </template>
    </f-overlay>

    <f-overlay :scrim="false">
      <template #activator="{ props }">
        <f-btn v-bind="props">No scrim</f-btn>
      </template>
      <template #default="{ close }">
        <div class="sheet">
          <p>Without a scrim the page behind stays visible — press Escape or use the button.</p>
          <f-btn color="primary" size="small" @click="close">Close</f-btn>
        </div>
      </template>
    </f-overlay>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.sheet {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  max-width: 320px;
  padding: 20px;
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
  box-shadow: var(--fui-elevation-12);
}
.sheet p {
  margin: 0;
}
</style>
