<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const deleted = ref(false)

function confirm() {
  deleted.value = true
  open.value = false
}
</script>

<template>
  <div class="row">
    <f-btn color="danger" prepend-icon="trash" @click="open = true">Delete project</f-btn>
    <span v-if="deleted" class="note">Project deleted.</span>

    <f-popup v-model="open" title="Delete “Aurora”?" :width="380">
      <p>
        Deleting the project removes its deployments, environment variables and domains. This can't
        be undone.
      </p>

      <template #actions="{ close }">
        <f-btn variant="text" @click="close">Keep it</f-btn>
        <f-btn color="danger" @click="confirm">Delete</f-btn>
      </template>
    </f-popup>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.note {
  font-size: 0.9rem;
  opacity: 0.6;
}
</style>
