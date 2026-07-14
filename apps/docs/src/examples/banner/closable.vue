<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <div class="stack">
    <f-banner
      v-model="visible"
      closable
      color="success"
      icon="check-circle"
      text="Your domain acme.dev is verified and now serving traffic."
      rounded
    />

    <f-btn v-if="!visible" variant="tonal" size="small" @click="visible = true">
      Bring the banner back
    </f-btn>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
</style>
