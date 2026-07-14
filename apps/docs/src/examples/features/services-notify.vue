<script setup>
import { useNotify } from '@rukkiecodes/vue'

const { notify, clear } = useNotify()

// A real save flow: a sticky "working" toast, replaced by the outcome.
async function save() {
  const working = notify({
    text: 'Saving changes…',
    loading: true,
    duration: 0, // stays until we dismiss it
    position: 'top-right',
  })

  await new Promise(resolve => setTimeout(resolve, 1400))

  working.dismiss()
  notify.success({
    title: 'Saved',
    text: 'Your changes are live.',
    position: 'top-right',
    progress: true,
  })
}

function fail() {
  notify.error({
    title: 'Deploy failed',
    text: 'The build exited with code 1.',
    position: 'top-right',
    duration: 0,
    border: 'danger',
    flat: true,
  })
}
</script>

<template>
  <div class="row">
    <f-btn color="primary" @click="save">Save</f-btn>
    <f-btn color="danger" variant="tonal" @click="fail">Trigger an error</f-btn>
    <f-btn variant="text" @click="clear">Clear all</f-btn>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
