<script setup>
import { ref } from 'vue'
const density = ref('default')
const options = ['default', 'comfortable', 'compact']
</script>

<template>
  <div>
    <div class="d-flex" style="gap: 8px; margin-bottom: 20px; flex-wrap: wrap">
      <f-btn
        v-for="d in options"
        :key="d"
        size="small"
        :variant="density === d ? 'elevated' : 'outlined'"
        @click="density = d"
      >
        {{ d }}
      </f-btn>
      <f-btn
        size="small"
        :variant="density === 'none' ? 'elevated' : 'outlined'"
        @click="density = 'none'"
      >
        no-gutters
      </f-btn>
    </div>

    <div class="grid-demo">
      <f-row :density="density === 'none' ? 'default' : density" :no-gutters="density === 'none'">
        <f-col v-for="n in 4" :key="n" cols="3"><div class="grid-demo__cell">3</div></f-col>
      </f-row>
    </div>
  </div>
</template>
