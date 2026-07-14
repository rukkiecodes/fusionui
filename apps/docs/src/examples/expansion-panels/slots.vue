<template>
  <f-expansion-panels variant="accordion">
    <f-expansion-panel expand-icon="chevron-down">
      <template #title>
        <span class="head">
          <f-icon icon="server" size="small" />
          Production
          <f-chip size="x-small" color="success" variant="tonal">healthy</f-chip>
        </span>
      </template>

      <div class="body">
        <p>3 instances in eu-west-1 · p95 latency 84 ms</p>
        <f-btn size="small" variant="tonal">Open logs</f-btn>
      </div>
    </f-expansion-panel>

    <f-expansion-panel expand-icon="chevron-down">
      <template #title>
        <span class="head">
          <f-icon icon="server" size="small" />
          Staging
          <f-chip size="x-small" color="warning" variant="tonal">degraded</f-chip>
        </span>
      </template>

      <div class="body">
        <p>1 instance in eu-west-1 · p95 latency 512 ms</p>
        <f-btn size="small" variant="tonal">Open logs</f-btn>
      </div>
    </f-expansion-panel>
  </f-expansion-panels>
</template>

<style scoped>
.head {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.body p {
  margin: 0;
  opacity: 0.75;
}
</style>
