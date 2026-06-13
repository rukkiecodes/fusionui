<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px">
    <f-alert type="success">
      <template #title>Success</template>
      Your changes were saved.
    </f-alert>
    <f-alert type="warning">
      <template #title>Warning</template>
      Double-check the details before continuing.
    </f-alert>
    <f-alert type="error">
      <template #title>Error</template>
      Something went wrong — please try again.
    </f-alert>
    <f-alert color="primary" icon="bell">
      <template #title>Custom icon</template>
      Pass any icon name to the <b>icon</b> prop.
    </f-alert>
  </div>
</template>
