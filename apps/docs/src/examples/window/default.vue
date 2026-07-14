<script setup lang="ts">
import { ref } from 'vue'

const step = ref('welcome')

const slides = [
  { value: 'welcome', color: 'primary', title: 'Welcome to Orbit', body: 'Ship faster.' },
  { value: 'connect', color: 'secondary', title: 'Connect a repo', body: 'GitHub or GitLab.' },
  { value: 'deploy', color: 'success', title: 'Deploy', body: 'Every push, automatically.' },
]
</script>

<template>
  <f-window v-model="step" show-arrows class="demo">
    <f-window-item v-for="slide in slides" :key="slide.value" :value="slide.value">
      <f-sheet :color="slide.color" rounded class="slide">
        <h3>{{ slide.title }}</h3>
        <p>{{ slide.body }}</p>
      </f-sheet>
    </f-window-item>
  </f-window>
</template>

<style scoped>
.demo {
  width: 100%;
  max-width: 520px;
}

.slide {
  display: grid;
  place-content: center;
  gap: 6px;
  height: 200px;
  padding: 24px;
  text-align: center;
}

.slide h3 {
  margin: 0;
  font-size: 1.25rem;
}

.slide p {
  margin: 0;
  opacity: 0.85;
}
</style>
