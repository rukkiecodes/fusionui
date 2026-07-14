<template>
  <div class="row">
    <f-badge dot>
      <f-icon icon="bell" size="large" />
    </f-badge>

    <f-badge dot color="success">
      <f-avatar circle image="https://i.pravatar.cc/120?img=24" />
    </f-badge>

    <f-badge dot color="warning">
      <f-btn variant="outlined" prepend-icon="settings">Settings</f-btn>
    </f-badge>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}
</style>
