<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <div class="stack">
    <f-btn size="small" variant="tonal" @click="loading = !loading">
      {{ loading ? 'Finish loading' : 'Load again' }}
    </f-btn>

    <f-skeleton :loading="loading" type="list-item-avatar-two-line" :max-width="420">
      <div class="person">
        <f-avatar circle image="https://i.pravatar.cc/120?img=24" />
        <div>
          <strong>Dana Whitfield</strong>
          <p>Staff engineer · Platform</p>
        </div>
      </div>
    </f-skeleton>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.person {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 420px;
}

.person p {
  margin: 2px 0 0;
  font-size: 0.875rem;
  opacity: 0.7;
}
</style>
