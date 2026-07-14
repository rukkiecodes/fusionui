<script setup lang="ts">
import { ref } from 'vue'

const tag = ref('#e91e63')
</script>

<template>
  <div class="w">
    <!-- Swatches only: no canvas, no sliders, no numeric inputs. -->
    <f-color-picker
      v-model="tag"
      hide-canvas
      hide-sliders
      hide-inputs
      show-swatches
      :width="240"
      :elevation="0"
    />
    <code>{{ tag }}</code>
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
