<script setup>
const sizes = ['x-small', 'small', 'default', 'large', 'x-large']
</script>

<template>
  <div class="row">
    <f-btn v-for="size in sizes" :key="size" :size="size" color="primary">
      {{ size }}
    </f-btn>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
</style>
