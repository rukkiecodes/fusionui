<script setup>
const items = [
  {
    value: 'src',
    title: 'src',
    children: [
      {
        value: 'components',
        title: 'components',
        children: [
          { value: 'FBtn.vue', title: 'FBtn.vue' },
          { value: 'FCard.vue', title: 'FCard.vue' },
          { value: 'FTreeview.vue', title: 'FTreeview.vue' },
        ],
      },
      {
        value: 'composables',
        title: 'composables',
        children: [
          { value: 'useTheme.ts', title: 'useTheme.ts' },
          { value: 'useProxiedModel.ts', title: 'useProxiedModel.ts' },
        ],
      },
      { value: 'main.ts', title: 'main.ts' },
    ],
  },
  {
    value: 'public',
    title: 'public',
    children: [
      { value: 'favicon.svg', title: 'favicon.svg' },
      { value: 'robots.txt', title: 'robots.txt' },
    ],
  },
  { value: 'package.json', title: 'package.json' },
  { value: 'README.md', title: 'README.md', disabled: true },
]
</script>

<template>
  <div class="w">
    <f-treeview :items="items" :opened="['src']" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  text-align: start;
}
</style>
