<template>
  <f-collapse>
    <template #title>
      <span class="title">
        <f-icon icon="shield" size="small" />
        Security settings
        <f-chip size="small" color="warning">2 to review</f-chip>
      </span>
    </template>

    <p>Two-factor authentication is off, and one API key hasn't been rotated in 12 months.</p>
  </f-collapse>
</template>

<style scoped>
.title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
</style>
