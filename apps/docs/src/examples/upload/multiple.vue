<script setup lang="ts">
import { ref } from 'vue'

const attachments = ref<File[]>([])
</script>

<template>
  <div class="w">
    <f-upload
      v-model="attachments"
      multiple
      text="Drop your attachments here, or click to browse"
    />
    <p class="count">{{ attachments.length }} file(s) ready to send</p>
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.count {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
