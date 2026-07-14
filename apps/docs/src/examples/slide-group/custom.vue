<script setup lang="ts">
import { ref } from 'vue'

const reviewer = ref(3)

const people = [
  { id: 1, name: 'Dana', img: 11 },
  { id: 2, name: 'Ravi', img: 12 },
  { id: 3, name: 'Mei', img: 13 },
  { id: 4, name: 'Tomás', img: 14 },
  { id: 5, name: 'Aïcha', img: 15 },
  { id: 6, name: 'Jonas', img: 16 },
  { id: 7, name: 'Priya', img: 17 },
]
</script>

<template>
  <f-slide-group v-model="reviewer" mandatory center-active class="rail">
    <f-slide-group-item v-for="person in people" :key="person.id" :value="person.id" class="person">
      <template #default="{ isSelected }">
        <f-avatar
          circle
          :history="isSelected"
          :image="`https://i.pravatar.cc/120?img=${person.img}`"
        />
        <span>{{ person.name }}</span>
      </template>
    </f-slide-group-item>
  </f-slide-group>
</template>

<style scoped>
.rail {
  width: 100%;
  min-width: 0;
}

.person {
  flex-direction: column;
  gap: 8px;
  font-size: 0.8125rem;
}
</style>
