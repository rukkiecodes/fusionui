<script setup>
import { ref } from 'vue'

const airport = ref(null)
const airports = [
  { title: 'Amsterdam Schiphol', value: 'AMS' },
  { title: 'Lagos Murtala Muhammed', value: 'LOS' },
  { title: 'London Heathrow', value: 'LHR' },
  { title: 'Los Angeles International', value: 'LAX' },
  { title: 'Nairobi Jomo Kenyatta', value: 'NBO' },
  { title: 'Paris Charles de Gaulle', value: 'CDG' },
]

// Match the IATA code as well as the airport name, so "LOS" finds Lagos.
function byNameOrCode(title, query, item) {
  const q = query.toLowerCase()
  return title.toLowerCase().includes(q) || item.value.toLowerCase().includes(q)
}
</script>

<template>
  <div class="w">
    <f-autocomplete
      v-model="airport"
      :items="airports"
      :custom-filter="byNameOrCode"
      auto-select-first
      label="Airport"
      placeholder="Name or code — try LOS"
    />
    <code>{{ airport ?? 'null' }}</code>
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
