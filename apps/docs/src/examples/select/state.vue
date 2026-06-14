<script setup>
import { ref } from 'vue'
const a = ref('Approved')
const b = ref('Rejected')
const items = ['Approved', 'Pending', 'Rejected']
</script>

<template>
  <div class="w">
    <f-select
      v-model="a"
      :items="items"
      state="success"
      label="Status"
      hint="Looks good"
      persistent-hint
      class="s"
    />
    <f-select
      v-model="b"
      :items="items"
      state="danger"
      label="Status"
      hint="Needs another look"
      persistent-hint
      class="s"
    />
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}
.s {
  width: 220px;
}
</style>
