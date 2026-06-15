<script setup lang="ts">
import { onBeforeUnmount, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@rukkiecodes/vue'
import { nav } from './nav'
import { highlightMarkdown } from './prism'

const theme = useTheme()
const route = useRoute()
const drawer = ref(false)

// Syntax-highlight the page's fenced code blocks after each navigation (the
// markdown plugin emits them as plain text). rAF lets the new page mount first.
watch(
  () => route.fullPath,
  () => nextTick(() => requestAnimationFrame(() => highlightMarkdown())),
  { immediate: true }
)

// The sidebar is part of the layout on desktop and an overlay drawer on mobile.
const media = typeof window !== 'undefined' ? window.matchMedia('(min-width: 880px)') : null
const isDesktop = ref(media?.matches ?? true)
const onMedia = (e: MediaQueryListEvent) => (isDesktop.value = e.matches)
media?.addEventListener('change', onMedia)
onBeforeUnmount(() => media?.removeEventListener('change', onMedia))

function toggleTheme() {
  theme.toggle()
}
</script>

<template>
  <div class="docs" :class="theme.themeClasses.value">
    <f-navbar
      square
      not-line
      class="docs__bar"
      :goo-corner="isDesktop"
      :corner-size="20"
      sidebar-selector=".docs__sidebar"
    >
      <template #left>
        <button
          v-if="!isDesktop"
          class="docs__menu-btn"
          aria-label="Menu"
          @click.stop="drawer = !drawer"
        >
          <f-icon icon="menu" />
        </button>
        <router-link to="/" class="docs__brand">
          <f-icon icon="feather" color="primary" />
          <strong>FusionUI</strong>
        </router-link>
      </template>
      <template #right>
        <f-btn
          variant="text"
          :icon="theme.isDark.value ? 'sun' : 'moon'"
          :aria-label="theme.isDark.value ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        />
        <f-btn
          variant="text"
          href="https://github.com/rukkiecodes/fusionui"
          target="_blank"
          icon="github"
          aria-label="GitHub"
        />
      </template>
    </f-navbar>

    <div class="docs__body">
      <f-sidebar
        :model-value="route.path"
        :permanent="isDesktop"
        :open="drawer"
        :class="{ docs__sidebar: isDesktop }"
        @update:open="drawer = $event"
        @update:model-value="drawer = false"
      >
        <template v-if="!isDesktop" #logo>
          <f-icon icon="feather" color="primary" size="medium" />
        </template>

        <div v-for="section in nav" :key="section.title" class="docs__nav-section">
          <div class="docs__nav-title">{{ section.title }}</div>
          <template v-for="item in section.items" :key="item.to || item.title">
            <f-sidebar-group v-if="item.items" open>
              <template #header>
                <f-sidebar-item>{{ item.title }}</f-sidebar-item>
              </template>
              <f-sidebar-item v-for="sub in item.items" :id="sub.to" :key="sub.to" :to="sub.to">
                {{ sub.title }}
              </f-sidebar-item>
            </f-sidebar-group>
            <f-sidebar-item v-else :id="item.to" :to="item.to">{{ item.title }}</f-sidebar-item>
          </template>
        </div>
      </f-sidebar>

      <main class="docs__main">
        <article class="docs__content markdown-body">
          <router-view />
        </article>
      </main>
    </div>
  </div>
</template>
