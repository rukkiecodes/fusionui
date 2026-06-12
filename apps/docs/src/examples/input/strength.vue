<script setup>
import { computed, ref } from 'vue'
const pwd = ref('')
const progress = computed(() => Math.min(100, pwd.value.length * 14))
</script>

<template>
  <vd-input
    v-model="pwd"
    type="password"
    label="Password"
    label-placeholder
    :progress="progress"
    hint="The bar turns from red to green as it gets stronger."
    persistent-hint
    style="max-width: 320px"
  />
</template>
