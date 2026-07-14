<template>
  <div class="grid">
    <f-value-card accent tag="For platform teams" title="Stop being the deploy bottleneck">
      <p class="copy">
        Hand product engineers a paved road they actually want to use, and keep the guardrails you
        need in code review rather than in a ticket queue.
      </p>
      <f-check-list
        :items="[
          'Policy-as-code for every environment',
          'Per-team deploy budgets and quotas',
          'Audit log streamed to your SIEM',
        ]"
      />
      <f-btn class="cta" color="primary" append-icon="arrow-right">Read the platform guide</f-btn>
    </f-value-card>

    <f-value-card tag="For product teams" title="Ship the feature, not the pipeline">
      <p class="copy">
        Push a branch and get a working URL. No YAML archaeology, no waiting on someone else's queue
        to see your own change running.
      </p>
      <f-check-list
        color="success"
        :items="[
          'A preview environment per pull request',
          'One-click promotion to production',
          'Rollback from the same screen',
        ]"
      />
      <f-btn class="cta" variant="outlined" append-icon="arrow-right">See a preview deploy</f-btn>
    </f-value-card>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.copy {
  margin: 0 0 18px;
  line-height: 1.6;
  opacity: 0.72;
}

.cta {
  margin-top: 22px;
}
</style>
