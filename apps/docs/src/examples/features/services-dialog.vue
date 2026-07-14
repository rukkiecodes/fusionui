<script setup>
import { ref } from 'vue'
import { useDialog } from '@rukkiecodes/vue'

const dialog = useDialog()
const result = ref('—')

async function alert() {
  await dialog.alert({
    title: 'Trial ending',
    text: 'Your trial ends in three days.',
    acceptText: 'Got it',
  })
  result.value = 'acknowledged'
}

async function confirm() {
  const ok = await dialog.confirm({
    title: 'Delete project',
    text: 'This removes the project and its history. It cannot be undone.',
    acceptText: 'Delete',
    cancelText: 'Keep it',
    color: 'danger',
  })
  result.value = ok ? 'confirmed → deleting' : 'cancelled'
}

async function prompt() {
  const name = await dialog.prompt({
    title: 'Rename project',
    text: 'Pick something you will recognise in six months.',
    placeholder: 'Project name',
    defaultValue: 'acme-web',
  })
  // Cancel resolves to null, so an empty string stays distinguishable.
  result.value = name === null ? 'cancelled' : `renamed to “${name}”`
}
</script>

<template>
  <div class="stack">
    <div class="row">
      <f-btn variant="tonal" @click="alert">alert()</f-btn>
      <f-btn variant="tonal" color="danger" @click="confirm">confirm()</f-btn>
      <f-btn variant="tonal" color="success" @click="prompt">prompt()</f-btn>
    </div>
    <div class="result">
      resolved with: <code>{{ result }}</code>
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.result {
  font-size: 0.8rem;
  color: rgba(var(--fui-theme-on-surface), 0.55);
}

code {
  font-family: var(--fui-font-family-mono);
}
</style>
