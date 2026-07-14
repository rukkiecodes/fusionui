<template>
  <div class="stack">
    <f-tabs align="center">
      <f-tab text="Monthly" />
      <f-tab text="Yearly" />
    </f-tabs>

    <f-tabs align="end">
      <f-tab text="Monthly" />
      <f-tab text="Yearly" />
    </f-tabs>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
</style>
