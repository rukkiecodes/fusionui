<script setup lang="ts">
const items = [
  {
    icon: 'user-plus',
    title: 'Sign up',
    text: 'Create an account with your work email — no credit card needed.',
  },
  {
    icon: 'sliders',
    title: 'Configure',
    text: 'Choose the checks that run on every pull request.',
  },
  {
    icon: 'rocket',
    title: 'Launch',
    text: 'Go live on a custom domain with automatic TLS.',
  },
]
</script>

<template>
  <f-steps :items="items" />
</template>
