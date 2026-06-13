<template>
  <f-alert color="primary" style="max-width: 560px">
    <template #title>Update available</template>
    A new version of the app is ready to install.
    <template #footer>
      <f-btn variant="text" size="small">Later</f-btn>
      <f-btn variant="flat" size="small" color="primary">Update now</f-btn>
    </template>
  </f-alert>
</template>
