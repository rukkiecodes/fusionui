<script setup>
import { computed, ref } from 'vue'
const pwd = ref('')
const checks = [/[#?!@$%^&*-]/, /.{7,}/, /[a-z]/, /[A-Z]/, /\d/]
const progress = computed(() => checks.reduce((p, re) => p + (re.test(pwd.value) ? 20 : 0), 0))
</script>

<template>
  <vd-input v-model="pwd" type="password" label="Password" :progress="progress" />
</template>
