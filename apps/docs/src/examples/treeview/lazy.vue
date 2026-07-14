<script setup>
import { ref } from 'vue'

// An empty `children` array is what marks a node as a branch that has not been
// loaded yet — a leaf has no `children` key at all.
const items = ref([
  { value: 'engineering', title: 'Engineering', children: [] },
  { value: 'design', title: 'Design', children: [] },
  { value: 'sales', title: 'Sales', children: [] },
])

const staff = {
  engineering: ['Lana Steiner', 'Candice Wu', 'Orlando Diggs', 'Phoenix Baker'],
  design: ['Demi Wilkinson', 'Kate Morrison'],
  sales: ['Natali Craig', 'Drew Cano', 'Andi Lane'],
}

/** Called once, the first time a branch with empty children is opened. */
async function loadChildren(item) {
  await new Promise(resolve => setTimeout(resolve, 900))
  item.children.push(
    ...staff[item.value].map(name => ({
      value: `${item.value}/${name}`,
      title: name,
    }))
  )
}
</script>

<template>
  <div class="w">
    <f-treeview :items="items" :load-children="loadChildren" />
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
