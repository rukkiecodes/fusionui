<template>
  <f-popup title="Invite a teammate">
    <template #activator="{ props }">
      <f-btn v-bind="props" color="primary" prepend-icon="user-plus">Invite</f-btn>
    </template>

    <p>
      They'll get an email with a link to join <strong>Northwind</strong>. Invites expire after
      seven days.
    </p>
  </f-popup>
</template>
