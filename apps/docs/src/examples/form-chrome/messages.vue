<template>
  <div class="stack">
    <f-messages active messages="Your password is stored hashed — we never see it." />

    <f-messages
      active
      color="danger"
      :messages="['Passwords must be at least 12 characters.', 'Passwords must contain a number.']"
    />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
