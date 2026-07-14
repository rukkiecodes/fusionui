<template>
  <div class="row">
    <f-badge content="3">
      <f-icon icon="alert-circle" size="large" />
    </f-badge>

    <f-badge content="8" color="primary">
      <f-icon icon="message-square" size="large" />
    </f-badge>

    <f-badge content="2" color="success">
      <f-icon icon="check-circle" size="large" />
    </f-badge>

    <f-badge content="5" color="warning">
      <f-icon icon="clock" size="large" />
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
