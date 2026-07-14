<template>
  <div class="stack">
    <f-collapse title="Can I change plans later?">
      <p>Yes — upgrades apply immediately and downgrades take effect at the next renewal.</p>
    </f-collapse>

    <f-collapse title="Do you offer discounts for non-profits?">
      <p>We do. Send us proof of status and we'll apply a 50% discount to any paid plan.</p>
    </f-collapse>

    <f-collapse title="Where is my data stored?">
      <p>In the region you pick when creating the workspace: Frankfurt, Virginia, or Sydney.</p>
    </f-collapse>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
