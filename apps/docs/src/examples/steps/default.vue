<script setup lang="ts">
const items = [
  {
    title: 'Create your workspace',
    text: 'Name it, pick a region, and invite the teammates you work with every day.',
  },
  {
    title: 'Connect a repository',
    text: 'Link GitHub or GitLab so every push shows up as a preview deployment.',
  },
  {
    title: 'Ship to production',
    text: 'Promote a preview with one click — rollbacks are always one click back.',
  },
]
</script>

<template>
  <f-steps :items="items" />
</template>
