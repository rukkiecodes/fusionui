<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vue-dl'
import { nav } from './nav'

const theme = useTheme()
const drawer = ref(false)

function toggleTheme() {
  theme.toggle()
}
</script>

<template>
  <div class="docs" :class="theme.themeClasses.value">
    <header class="docs__bar">
      <button class="docs__menu-btn" aria-label="Menu" @click="drawer = !drawer">
        <vd-icon icon="menu" />
      </button>
      <router-link to="/" class="docs__brand">
        <vd-icon icon="feather" color="primary" />
        <strong>Vue DL</strong>
      </router-link>
      <div style="flex: 1 1 auto" />
      <vd-btn variant="text" :icon="theme.isDark.value ? 'sun' : 'moon'" @click="toggleTheme" />
      <vd-btn
        variant="text"
        href="https://github.com"
        target="_blank"
        icon="github"
        aria-label="GitHub"
      />
    </header>

    <div class="docs__body">
      <aside class="docs__sidebar" :class="{ 'docs__sidebar--open': drawer }">
        <nav>
          <div v-for="section in nav" :key="section.title" class="docs__nav-section">
            <p class="docs__nav-title">{{ section.title }}</p>
            <router-link
              v-for="item in section.items"
              :key="item.to"
              :to="item.to"
              class="docs__nav-link"
              active-class="docs__nav-link--active"
              @click="drawer = false"
            >
              {{ item.title }}
            </router-link>
          </div>
        </nav>
      </aside>

      <main class="docs__main">
        <article class="docs__content markdown-body">
          <router-view />
        </article>
      </main>
    </div>
  </div>
</template>
