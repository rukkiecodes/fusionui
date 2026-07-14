<script setup lang="ts">
import { ref } from 'vue'

const recipients = ref(['ada@fusion.dev', 'grace@fusion.dev', 'linus@fusion.dev'])

function remove(email: string) {
  recipients.value = recipients.value.filter(r => r !== email)
}
</script>

<template>
  <div class="row">
    <f-chip
      v-for="email in recipients"
      :key="email"
      closable
      color="primary"
      prepend-icon="mail"
      @click:close="remove(email)"
    >
      {{ email }}
    </f-chip>
    <span v-if="!recipients.length" class="empty">No recipients left.</span>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 32px;
}
.empty {
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
