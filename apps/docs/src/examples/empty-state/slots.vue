<template>
  <f-empty-state icon="users">
    <template #title> You're the only one in <strong>Northwind</strong> </template>
    <template #text>
      Invite teammates by email, or share the join link — anyone with it can request access.
    </template>

    <div class="actions">
      <f-btn color="primary" prepend-icon="mail">Invite by email</f-btn>
      <f-btn variant="text" prepend-icon="link">Copy join link</f-btn>
    </div>
  </f-empty-state>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
