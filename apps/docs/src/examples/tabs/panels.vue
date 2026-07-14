<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('overview')
</script>

<template>
  <f-tabs v-model="tab">
    <f-tab value="overview" text="Overview" />
    <f-tab value="billing" text="Billing" />
    <f-tab value="members" text="Members" />
  </f-tabs>

  <f-tabs-window v-model="tab">
    <f-tab-panel value="overview">
      <p>Your workspace is on the Team plan and renews on 1 August.</p>
    </f-tab-panel>
    <f-tab-panel value="billing">
      <p>The card ending in 4242 is charged $49 per seat, per month.</p>
    </f-tab-panel>
    <f-tab-panel value="members">
      <p>8 of your 12 seats are in use. Invite teammates from the members page.</p>
    </f-tab-panel>
  </f-tabs-window>
</template>
