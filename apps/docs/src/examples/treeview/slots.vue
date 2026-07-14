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
          { value: 'FBtn.vue', title: 'FBtn.vue', size: '4.2 kB' },
          { value: 'FDataTable.tsx', title: 'FDataTable.tsx', size: '9.8 kB', changed: true },
        ],
      },
      { value: 'main.ts', title: 'main.ts', size: '1.1 kB' },
    ],
  },
  {
    value: 'tests',
    title: 'tests',
    children: [{ value: 'FDataTable.spec.ts', title: 'FDataTable.spec.ts', size: '6.4 kB' }],
  },
]
</script>

<template>
  <div class="w">
    <f-treeview :items="items" open-all>
      <!-- Slot props: item, node, level, isOpen, isSelected, isIndeterminate, isActive, isLoading -->
      <template #prepend="{ item, isOpen }">
        <f-icon
          :icon="item.children ? 'folder' : 'file-text'"
          size="small"
          :color="item.children && isOpen ? 'primary' : undefined"
        />
      </template>

      <template #append="{ item }">
        <span class="meta">
          <f-chip v-if="item.changed" size="small" color="warning">modified</f-chip>
          <span v-if="item.size" class="size">{{ item.size }}</span>
        </span>
      </template>
    </f-treeview>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  text-align: start;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.size {
  font-size: 0.75rem;
  opacity: 0.55;
  font-variant-numeric: tabular-nums;
}
</style>
