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
    />
    <f-select
      v-model="b"
      :items="items"
      state="danger"
      label="Status"
      hint="Needs another look"
      persistent-hint
    />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
