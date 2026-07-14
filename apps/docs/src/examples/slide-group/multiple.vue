<script setup lang="ts">
import { ref } from 'vue'

const toppings = ref(['mozzarella'])

const options = [
  'mozzarella',
  'basil',
  'prosciutto',
  'olives',
  'rocket',
  'chilli',
  'artichoke',
  'anchovy',
]
</script>

<template>
  <div class="stack">
    <f-slide-group v-model="toppings" multiple :max="3">
      <f-slide-group-item v-for="option in options" :key="option" :value="option" :text="option" />
    </f-slide-group>

    <p class="state">{{ toppings.length }} of 3 picked: {{ toppings.join(', ') }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.state {
  margin: 0;
  font-family: var(--fui-font-family-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
}
</style>
