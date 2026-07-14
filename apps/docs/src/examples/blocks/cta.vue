<template>
  <div class="stack">
    <f-cta
      title="Your next deploy could be the quiet one."
      text="Join 12,000 engineers who stopped babysitting dashboards on Friday nights."
    >
      <f-btn color="primary" size="large">Start free</f-btn>
      <f-btn variant="outlined" size="large">Talk to sales</f-btn>
    </f-cta>

    <f-cta
      variant="flat"
      title="Migrating from a homegrown pipeline?"
      text="Our team will port your first three services for free — usually inside a week."
    >
      <f-btn color="primary" size="large" append-icon="arrow-right">Request a migration</f-btn>
    </f-cta>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
