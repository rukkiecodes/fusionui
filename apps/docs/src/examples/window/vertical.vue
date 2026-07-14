<script setup lang="ts">
import { ref } from 'vue'

const tip = ref(0)

const tips = [
  'Press Ctrl + K to open the command palette.',
  'Drag a deployment onto another to compare their logs side by side.',
  'Pin a project to keep it at the top of your dashboard.',
]
</script>

<template>
  <f-window v-model="tip" direction="vertical" show-arrows continuous class="demo">
    <f-window-item v-for="(text, i) in tips" :key="i" :value="i">
      <f-sheet border rounded class="tip">
        <f-icon icon="zap" color="warning" />
        <p>{{ text }}</p>
      </f-sheet>
    </f-window-item>
  </f-window>
</template>

<style scoped>
.demo {
  width: 100%;
  max-width: 480px;
}

.tip {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 96px;
  padding: 20px 56px 20px 20px;
}

.tip p {
  margin: 0;
}
</style>
