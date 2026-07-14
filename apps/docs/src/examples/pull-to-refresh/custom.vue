<script setup lang="ts">
import { ref } from 'vue'

const refreshing = ref(false)
const messages = ref([
  'Ada: shipped the migration',
  'Grace: review left on #204',
  'Alan: standup moved to 10:30',
  'Katherine: numbers look right now',
  'Barbara: types are green',
  'Ada: rolling back #201',
  'Grace: merged',
])

// `v-model` is the other way to end a refresh — set it to false when you are done.
function onLoad(): void {
  setTimeout(() => {
    messages.value.unshift('Ada: pulled fresh messages')
    refreshing.value = false
  }, 1400)
}
</script>

<template>
  <div class="scroller">
    <f-pull-to-refresh v-model="refreshing" :pull-down-threshold="80" @load="onLoad">
      <template #pullDown="{ canRefresh, refreshing: busy }">
        <p class="cue">
          {{ busy ? 'Refreshing…' : canRefresh ? 'Release to refresh' : 'Pull down to refresh' }}
        </p>
      </template>

      <ul class="feed">
        <li v-for="message in messages" :key="message" class="feed__row">{{ message }}</li>
      </ul>
    </f-pull-to-refresh>
  </div>
</template>

<style scoped>
.scroller {
  width: 100%;
  max-width: 360px;
  height: 240px;
  margin: 0 auto;
  overflow-y: auto;
  border-radius: var(--fui-radius-lg);
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
}
.cue {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgb(var(--fui-theme-primary));
}
.feed {
  margin: 0;
  padding: 0;
  list-style: none;
}
.feed__row {
  padding: 14px 16px;
  font-size: 0.88rem;
  border-bottom: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
}
</style>
