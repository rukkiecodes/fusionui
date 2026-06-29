<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
function open() {
  notify({
    title: 'Flat',
    text: 'A subtle tinted style instead of a filled colour.',
    color: 'danger',
    flat: true,
    position: 'bottom-right',
  })
}
</script>

<template>
  <f-btn color="danger" variant="flat" @click="open">Flat</f-btn>
</template>
