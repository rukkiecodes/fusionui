<script setup lang="ts">
function goBack() {
  // In a real app: router.back()
  console.log('back to Projects')
}
</script>

<template>
  <f-page-header
    back-label="Projects"
    title="checkout-api"
    subtitle="Production · eu-west-1 · deployed 6 minutes ago by mira@meridian.dev"
    @back="goBack"
  >
    <template #actions>
      <f-btn variant="outlined" prepend-icon="clock">History</f-btn>
      <f-btn color="primary" prepend-icon="rocket">Deploy</f-btn>
    </template>
  </f-page-header>
</template>
