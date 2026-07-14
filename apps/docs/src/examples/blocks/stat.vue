<template>
  <div class="grid">
    <f-stat icon="activity" value="99.98%" label="Uptime, trailing 90 days" />
    <f-stat icon="zap" value="8.4s" label="Average rollback" color="success" />
    <f-stat icon="trending-up" value="1.2M" label="Deploys shipped" color="#6d28d9" />
    <f-stat icon="users" value="12,000+" label="Engineers on Meridian" color="warning" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
</style>
