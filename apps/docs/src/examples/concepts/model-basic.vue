<script setup>
import { ref } from 'vue'

const name = ref('Ada')
const framework = ref('Vue')
const notify = ref(true)
const volume = ref(40)

const frameworks = ['Vue', 'React', 'Svelte', 'Solid']
</script>

<template>
  <div class="wrap">
    <div class="fields">
      <f-input v-model="name" label="Name" />
      <f-select v-model="framework" :items="frameworks" label="Framework" />
      <f-switch v-model="notify">Email me</f-switch>
      <f-slider v-model="volume" />
    </div>

    <pre class="state">{{ { name, framework, notify, volume } }}</pre>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
}
.fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 240px;
}
.state {
  margin: 0;
  padding: 12px 14px;
  min-width: 220px;
  border-radius: var(--fui-radius-md);
  background: rgba(var(--fui-theme-on-background), 0.05);
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.8rem;
  line-height: 1.6;
}
</style>
