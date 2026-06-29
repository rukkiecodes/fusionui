<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
function open() {
  notify({
    title: 'Notification',
    text: 'This is a default notification.',
    position: 'bottom-right',
  })
}
</script>

<template>
  <f-btn color="primary" @click="open">Open notification</f-btn>
</template>
