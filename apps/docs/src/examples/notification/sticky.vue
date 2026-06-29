<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
function open() {
  notify({
    title: 'Sticky',
    text: 'Set duration: 0 to keep it until the user closes it.',
    color: 'primary',
    duration: 0,
    position: 'bottom-right',
  })
}
</script>

<template>
  <f-btn color="primary" @click="open">Sticky</f-btn>
</template>
