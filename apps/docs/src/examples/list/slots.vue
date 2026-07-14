<script setup lang="ts">
import { ref } from 'vue'

const mentions = ref(true)
const digest = ref(false)
</script>

<template>
  <div class="w">
    <f-list>
      <f-list-item>
        <template #prepend>
          <f-avatar circle size="small" image="https://i.pravatar.cc/120?img=47" />
        </template>
        <div class="line">Ada Lovelace</div>
        <div class="muted">Reviewed your pull request</div>
        <template #append>
          <f-chip size="small" color="success">New</f-chip>
        </template>
      </f-list-item>

      <f-list-item title="Mentions" subtitle="Email me when I'm @mentioned">
        <template #append>
          <f-switch v-model="mentions" />
        </template>
      </f-list-item>

      <f-list-item title="Weekly digest" subtitle="A summary every Monday">
        <template #append>
          <f-switch v-model="digest" />
        </template>
      </f-list-item>
    </f-list>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
.line {
  font-size: 0.95rem;
}
.muted {
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
