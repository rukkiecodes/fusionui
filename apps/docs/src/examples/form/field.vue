<script setup lang="ts">
import { ref } from 'vue'

const departure = ref('2026-08-14')
</script>

<template>
  <div class="w">
    <f-field
      v-slot="{ id }"
      label="Departure"
      prepend-icon="calendar"
      hint="Flights leave at 06:40 and 19:10"
      persistent-hint
    >
      <input :id="id" v-model="departure" type="date" />
    </f-field>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}
</style>
