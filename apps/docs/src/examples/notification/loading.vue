<script setup>
import { useNotify } from '@rukkiecodes/vue'
const { notify } = useNotify()
function open() {
  const handle = notify({
    loading: true,
    color: 'primary',
    duration: 0,
    position: 'bottom-right',
    closable: false,
  })
  setTimeout(() => handle.dismiss(), 2500)
}
</script>

<template>
  <f-btn color="primary" @click="open">Loading</f-btn>
</template>
