<script setup>
import { ref } from 'vue'
const fluid = ref(false)
</script>

<template>
  <div>
    <div class="d-flex" style="gap: 8px; margin-bottom: 20px">
      <f-btn size="small" :variant="!fluid ? 'elevated' : 'outlined'" @click="fluid = false">
        centered
      </f-btn>
      <f-btn size="small" :variant="fluid ? 'elevated' : 'outlined'" @click="fluid = true">
        fluid
      </f-btn>
    </div>

    <div class="grid-demo" style="background: rgba(128, 128, 128, 0.08); border-radius: 12px">
      <f-container :fluid="fluid">
        <f-row>
          <f-col cols="6"><div class="grid-demo__cell">6</div></f-col>
          <f-col cols="6"><div class="grid-demo__cell">6</div></f-col>
        </f-row>
      </f-container>
    </div>
  </div>
</template>
