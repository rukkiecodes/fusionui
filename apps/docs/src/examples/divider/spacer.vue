<template>
  <div class="bar">
    <f-icon icon="folder" />
    <strong class="title">Q3 report</strong>

    <f-spacer />

    <f-btn variant="text">Discard</f-btn>
    <f-btn>Publish</f-btn>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}
.title {
  font-size: 0.95rem;
}
</style>
