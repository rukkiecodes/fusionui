<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('inbox')
</script>

<template>
  <div class="phone">
    <f-bottom-nav v-model="tab" grow mandatory>
      <f-bottom-nav-item value="inbox" icon="inbox" text="Inbox" />
      <f-bottom-nav-item value="sent" icon="send" text="Sent" />
      <f-bottom-nav-item value="archive" icon="archive" text="Archive" />
    </f-bottom-nav>
  </div>
</template>

<style scoped>
.phone {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: var(--fui-radius-lg);
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
}
</style>
