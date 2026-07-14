<template>
  <div class="stack">
    <f-banner
      color="warning"
      icon="alert-triangle"
      text="Scheduled maintenance on Sunday 02:00–04:00 UTC. Deploys will be paused."
      rounded
    >
      <template #actions>
        <f-btn color="warning" variant="text" size="small">Status page</f-btn>
      </template>
    </f-banner>

    <f-banner
      bg-color="primary"
      icon="rocket"
      text="FusionUI 1.0 is out — liquid glass surfaces, shaders and a native package."
      rounded
    >
      <template #actions>
        <f-btn color="light" variant="text" size="small">Read the notes</f-btn>
      </template>
    </f-banner>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
