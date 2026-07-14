<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('library')
</script>

<template>
  <div class="phone">
    <f-bottom-nav v-model="tab" mode="shift" grow mandatory color="danger">
      <f-bottom-nav-item value="listen" icon="play-circle" text="Listen now" />
      <f-bottom-nav-item value="browse" icon="grid" text="Browse" />
      <f-bottom-nav-item value="radio" icon="radio" text="Radio" />
      <f-bottom-nav-item value="library" icon="music" text="Library" />
    </f-bottom-nav>
  </div>
</template>

<style scoped>
.phone {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: var(--fui-radius-lg);
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
}
</style>
