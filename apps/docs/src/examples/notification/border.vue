<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
function open() {
  notify({
    title: 'Bordered',
    text: 'A coloured edge accent (its side follows the position).',
    border: 'success',
    position: 'bottom-right',
  })
}
</script>

<template>
  <f-btn color="success" @click="open">Border</f-btn>
</template>
