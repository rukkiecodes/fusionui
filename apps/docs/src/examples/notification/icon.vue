<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
function open() {
  notify({
    title: 'With icon',
    text: 'An icon sits on the left of the card.',
    color: 'primary',
    icon: 'bell',
    position: 'bottom-right',
  })
}
</script>

<template>
  <f-btn color="primary" @click="open">Icon</f-btn>
</template>
