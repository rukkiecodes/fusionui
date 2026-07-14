<template>
  <f-section
    center
    eyebrow="How it works"
    title="Three commands between your laptop and production"
  >
    <div class="grid">
      <f-feature
        icon="terminal"
        title="1 · Connect"
        text="Run meridian init in your repo. We detect the framework, the Dockerfile and the test command."
      />
      <f-feature
        icon="layers"
        title="2 · Preview"
        text="Every push builds a preview environment with its own URL, database branch and seeded data."
      />
      <f-feature
        icon="rocket"
        title="3 · Promote"
        text="Merge to main and the same artifact is canaried into production. No rebuild, no surprises."
      />
    </div>
  </f-section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  text-align: left;
}
</style>
