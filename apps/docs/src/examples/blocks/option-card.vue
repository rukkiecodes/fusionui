<script setup lang="ts">
import { ref } from 'vue'

const plan = ref('team')
</script>

<template>
  <div class="stack">
    <f-option-card
      icon="user"
      title="Hobby"
      text="One project, community support, deploys from a single branch. Free forever."
      :selected="plan === 'hobby'"
      @select="plan = 'hobby'"
    />
    <f-option-card
      icon="users"
      title="Team"
      text="Unlimited preview environments, canary deploys and a 99.9% uptime SLA. $24 per seat."
      :selected="plan === 'team'"
      @select="plan = 'team'"
    />
    <f-option-card
      icon="building"
      title="Enterprise"
      text="Self-hosted runners, SSO/SCIM and a named support engineer. Talk to us."
      :selected="plan === 'enterprise'"
      @select="plan = 'enterprise'"
    />
    <f-option-card
      icon="lock"
      title="Air-gapped"
      text="Available on the Enterprise plan only."
      disabled
    />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 520px;
}
</style>
