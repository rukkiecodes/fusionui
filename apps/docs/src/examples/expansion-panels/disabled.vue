<template>
  <div class="stack">
    <f-expansion-panels readonly :model-value="0">
      <f-expansion-panel
        title="Terms accepted on 4 March 2026"
        text="A readonly accordion renders its state but ignores clicks — the panel stays exactly as you left it."
      />
      <f-expansion-panel title="Data processing agreement" text="Signed by Dana Whitfield." />
    </f-expansion-panels>

    <f-expansion-panels>
      <f-expansion-panel title="Available" text="This one opens." />
      <f-expansion-panel disabled title="Locked (upgrade to Pro)" text="This one never does." />
    </f-expansion-panels>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
