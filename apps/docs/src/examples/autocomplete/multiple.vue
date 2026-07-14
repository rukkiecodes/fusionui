<script setup>
import { ref } from 'vue'

const reviewers = ref(['ada'])
const people = [
  { title: 'Ada Lovelace', value: 'ada' },
  { title: 'Grace Hopper', value: 'grace' },
  { title: 'Alan Turing', value: 'alan' },
  { title: 'Katherine Johnson', value: 'katherine' },
  { title: 'Barbara Liskov', value: 'barbara' },
]
</script>

<template>
  <div class="w">
    <f-autocomplete
      v-model="reviewers"
      :items="people"
      multiple
      label="Reviewers"
      placeholder="Search people"
    />
    <code>{{ reviewers }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
