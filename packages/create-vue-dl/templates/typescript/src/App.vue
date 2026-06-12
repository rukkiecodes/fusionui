<script setup lang="ts">
import { ref } from 'vue'
import { useNotify, useTheme } from 'vue-dl'

const { notify } = useNotify()
const theme = useTheme()
const count = ref(0)
</script>

<template>
  <vd-navbar fixed flat>
    <template #brand>
      <vd-icon icon="feather" color="primary" />
      <span>Vue DL</span>
    </template>
    <vd-spacer />
    <template #append>
      <vd-btn variant="text" :icon="theme.isDark.value ? 'sun' : 'moon'" @click="theme.toggle()" />
    </template>
  </vd-navbar>

  <main style="max-width: 760px; margin: 40px auto; padding: 0 20px">
    <vd-card
      style="margin-bottom: 24px"
      title="Welcome to Vue DL"
      subtitle="Built with Vite + Vue 3"
    >
      <vd-card-text>
        Edit <code>src/App.vue</code> and save to reload. Explore the components and the soft,
        Vuesax-inspired design.
      </vd-card-text>
      <vd-card-actions>
        <vd-btn color="primary" prepend-icon="zap" @click="count++">Clicked {{ count }}×</vd-btn>
        <vd-btn
          variant="tonal"
          color="success"
          @click="notify.success({ title: 'Nice!', text: 'Vue DL is working.' })"
        >
          Notify
        </vd-btn>
      </vd-card-actions>
    </vd-card>

    <div style="display: flex; gap: 10px; flex-wrap: wrap">
      <vd-chip color="primary">primary</vd-chip>
      <vd-chip color="success" variant="outlined">success</vd-chip>
      <vd-chip color="danger" prepend-icon="$warning">danger</vd-chip>
    </div>
  </main>
</template>
