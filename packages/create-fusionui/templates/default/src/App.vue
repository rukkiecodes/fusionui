<script setup>
import { ref } from 'vue'
import { useNotify, useTheme } from '@fusionui/vue'

const { notify } = useNotify()
const theme = useTheme()
const count = ref(0)
</script>

<template>
  <f-navbar fixed flat>
    <template #brand>
      <f-icon icon="feather" color="primary" />
      <span>FusionUI</span>
    </template>
    <f-spacer />
    <template #append>
      <f-btn variant="text" :icon="theme.isDark.value ? 'sun' : 'moon'" @click="theme.toggle()" />
    </template>
  </f-navbar>

  <main style="max-width: 760px; margin: 40px auto; padding: 0 20px">
    <f-card
      style="margin-bottom: 24px"
      title="Welcome to FusionUI"
      subtitle="Built with Vite + Vue 3"
    >
      <f-card-text>
        Edit <code>src/App.vue</code> and save to reload. Explore the components and the soft,
        Vuesax-inspired design.
      </f-card-text>
      <f-card-actions>
        <f-btn color="primary" prepend-icon="zap" @click="count++">Clicked {{ count }}×</f-btn>
        <f-btn
          variant="tonal"
          color="success"
          @click="notify.success({ title: 'Nice!', text: 'FusionUI is working.' })"
        >
          Notify
        </f-btn>
      </f-card-actions>
    </f-card>

    <div style="display: flex; gap: 10px; flex-wrap: wrap">
      <f-chip color="primary">primary</f-chip>
      <f-chip color="success" variant="outlined">success</f-chip>
      <f-chip color="danger" prepend-icon="$warning">danger</f-chip>
    </div>
  </main>
</template>
