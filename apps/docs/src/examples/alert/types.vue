<template>
  <div class="d-flex" style="flex-direction: column; gap: 12px">
    <vd-alert type="success" text="Your changes were saved." />
    <vd-alert type="info" title="Heads up" text="A new version is available." />
    <vd-alert type="warning" text="Your storage is almost full." border />
    <vd-alert type="error" text="Something went wrong." closable />
  </div>
</template>
