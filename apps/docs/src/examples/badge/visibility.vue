<script setup lang="ts">
import { ref } from 'vue'

const unread = ref(3)
</script>

<template>
  <div class="row">
    <f-badge :model-value="unread > 0" :content="unread">
      <f-icon icon="mail" size="large" />
    </f-badge>

    <f-btn variant="tonal" @click="unread++">New message</f-btn>
    <f-btn variant="outlined" :disabled="unread === 0" @click="unread = 0">Mark all read</f-btn>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
