<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const accepted = ref(false)

function accept() {
  accepted.value = true
  open.value = false
}
</script>

<template>
  <div class="row">
    <f-btn @click="open = true">Review terms</f-btn>
    <span v-if="accepted" class="note">Terms accepted.</span>

    <f-popup v-model="open" persistent :closable="false" title="Accept the updated terms">
      <p>
        We've updated our data-processing terms. Accept them to keep using the workspace — the scrim
        and the Escape key won't dismiss this one.
      </p>

      <template #actions>
        <f-btn color="primary" @click="accept">Accept</f-btn>
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
