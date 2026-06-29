<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
function open() {
  notify({
    title: 'Auto-dismiss',
    text: 'The progress bar counts down the remaining time.',
    color: 'primary',
    progress: true,
    duration: 5000,
    position: 'bottom-right',
  })
}
</script>

<template>
  <f-btn color="primary" @click="open">Progress</f-btn>
</template>
