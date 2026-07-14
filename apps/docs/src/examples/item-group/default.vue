<script setup lang="ts">
import { ref } from 'vue'

const plan = ref('team')

const plans = [
  { value: 'solo', name: 'Solo', price: '€9', blurb: '1 project, community support' },
  { value: 'team', name: 'Team', price: '€29', blurb: '10 projects, priority support' },
  { value: 'scale', name: 'Scale', price: '€99', blurb: 'Unlimited projects, SLA' },
]
</script>

<template>
  <f-item-group v-model="plan" mandatory>
    <f-item
      v-for="item in plans"
      :key="item.value"
      v-slot="{ selectedClass, toggle }"
      :value="item.value"
    >
      <f-sheet
        tag="button"
        type="button"
        border
        rounded
        class="plan"
        :class="selectedClass"
        @click="toggle"
      >
        <strong>{{ item.name }}</strong>
        <span class="price">{{ item.price }}/mo</span>
        <span class="blurb">{{ item.blurb }}</span>
      </f-sheet>
    </f-item>
  </f-item-group>
</template>

<style scoped>
.plan {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 180px;
  padding: 16px;
  text-align: start;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.price {
  font-size: 1.125rem;
  font-weight: 600;
}

.blurb {
  font-size: 0.8125rem;
  opacity: 0.7;
}
</style>
