<template>
  <div class="stack">
    <f-messages active messages="Choose a workspace name your team will recognise." />
    <f-messages active color="primary" messages="This name is available." />
    <f-messages active color="success" messages="Saved to your workspace settings." />
    <f-messages active color="warning" messages="Renaming will break existing invite links." />
    <f-messages active color="danger" messages="That name is already taken." />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
