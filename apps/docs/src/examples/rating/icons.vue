<script setup lang="ts">
import { ref } from 'vue'

const love = ref(4)
const heat = ref(2)
</script>

<template>
  <div class="stack">
    <f-rating
      v-model="love"
      full-icon="heart"
      empty-icon="heart"
      color="danger"
      hover
      aria-label="How much did you love it"
    />
    <f-rating
      v-model="heat"
      full-icon="zap"
      empty-icon="zap"
      color="warning"
      :length="3"
      hover
      aria-label="Spice level"
    />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
