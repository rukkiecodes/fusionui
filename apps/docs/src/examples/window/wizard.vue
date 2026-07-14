<script setup lang="ts">
import { computed, ref } from 'vue'

const step = ref(0)
const name = ref('')
const region = ref('eu-west-1')

const last = 2
const canContinue = computed(() => step.value < last)
</script>

<template>
  <f-sheet border rounded class="wizard">
    <f-window v-model="step" :touch="false">
      <f-window-item :value="0">
        <h3>Name your project</h3>
        <f-input v-model="name" label="Project name" placeholder="orbit-web" />
      </f-window-item>

      <f-window-item :value="1">
        <h3>Pick a region</h3>
        <f-select
          v-model="region"
          label="Region"
          :items="['eu-west-1', 'us-east-1', 'ap-south-1']"
        />
      </f-window-item>

      <f-window-item :value="2">
        <h3>Ready to deploy</h3>
        <p>
          Creating <strong>{{ name || 'orbit-web' }}</strong> in
          <strong>{{ region }}</strong>
        </p>
      </f-window-item>
    </f-window>

    <div class="controls">
      <f-btn variant="text" :disabled="step === 0" @click="step--">Back</f-btn>
      <f-spacer />
      <f-btn v-if="canContinue" variant="flat" @click="step++">Continue</f-btn>
      <f-btn v-else variant="flat" color="success">Create project</f-btn>
    </div>
  </f-sheet>
</template>

<style scoped>
.wizard {
  width: 100%;
  max-width: 420px;
  padding: 24px;
}

h3 {
  margin: 0 0 16px;
  font-size: 1.0625rem;
}

p {
  margin: 0;
  line-height: 1.6;
}

.controls {
  display: flex;
  align-items: center;
  margin-top: 24px;
}
</style>
