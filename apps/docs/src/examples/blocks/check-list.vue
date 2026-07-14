<template>
  <div class="grid">
    <div>
      <h4 class="heading">Included in Team</h4>
      <f-check-list
        :items="[
          'Unlimited preview environments',
          'Canary deploys with automatic rollback',
          'Database branching on every pull request',
          '99.9% uptime SLA',
        ]"
      />
    </div>

    <div>
      <h4 class="heading">Shipped this quarter</h4>
      <f-check-list
        icon="zap"
        color="success"
        :items="[
          'Deploy previews now boot in under 20 seconds',
          'Terraform provider reached 1.0',
          'Audit log streaming to Datadog and Splunk',
        ]"
      />
    </div>

    <div>
      <h4 class="heading">Custom rows</h4>
      <f-check-list>
        <li class="fui-checklist__item">
          <f-icon icon="check" class="fui-checklist__icon" color="success" />
          <span>SOC 2 Type II — <strong>renewed March 2025</strong></span>
        </li>
        <li class="fui-checklist__item">
          <f-icon icon="check" class="fui-checklist__icon" color="success" />
          <span>ISO 27001 — <strong>certified</strong></span>
        </li>
        <li class="fui-checklist__item">
          <f-icon icon="clock" class="fui-checklist__icon" color="warning" />
          <span>HIPAA — <strong>audit in progress</strong></span>
        </li>
      </f-check-list>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 28px;
}

.heading {
  margin: 0 0 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.6;
}
</style>
