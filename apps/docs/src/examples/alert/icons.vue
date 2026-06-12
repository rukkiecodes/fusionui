<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px">
    <vd-alert type="success">
      <template #title>Success</template>
      Your changes were saved.
    </vd-alert>
    <vd-alert type="warning">
      <template #title>Warning</template>
      Double-check the details before continuing.
    </vd-alert>
    <vd-alert type="error">
      <template #title>Error</template>
      Something went wrong — please try again.
    </vd-alert>
    <vd-alert color="primary" icon="bell">
      <template #title>Custom icon</template>
      Pass any icon name to the <b>icon</b> prop.
    </vd-alert>
  </div>
</template>
