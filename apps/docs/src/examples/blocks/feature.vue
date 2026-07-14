<template>
  <div class="grid">
    <f-feature
      hover
      icon="git-branch"
      title="Preview every branch"
      text="Each pull request gets a real, isolated environment with seeded data — reviewers click a link instead of pulling the branch."
    />
    <f-feature
      hover
      icon="activity"
      title="Regression detection"
      text="We baseline latency and error rates per route, then compare the new revision against them before shifting a single percent of traffic."
    />
    <f-feature
      hover
      icon="shield"
      title="Automatic rollback"
      text="If the canary breaches its budget, Meridian reverts to the last healthy revision and posts the diff to your incident channel."
    />
    <f-feature
      hover
      icon="terminal"
      title="Config as code"
      text="Everything lives in a single meridian.yaml, reviewed like the rest of your codebase. No click-ops, no drift."
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}
</style>
