<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vue-dl'
import { nav } from './nav'

const theme = useTheme()
const route = useRoute()
const drawer = ref(false)

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
    <vd-navbar square not-line class="docs__bar">
      <template #left>
        <button
          v-if="!isDesktop"
          class="docs__menu-btn"
          aria-label="Menu"
          @click.stop="drawer = !drawer"
        >
          <vd-icon icon="menu" />
        </button>
        <router-link to="/" class="docs__brand">
          <vd-icon icon="feather" color="primary" />
          <strong>Vue DL</strong>
        </router-link>
      </template>
      <template #right>
        <vd-btn variant="text" :icon="theme.isDark.value ? 'sun' : 'moon'" @click="toggleTheme" />
        <vd-btn
          variant="text"
          href="https://github.com/rukkiecodes/vue-dl"
          target="_blank"
          icon="github"
          aria-label="GitHub"
        />
      </template>
    </vd-navbar>

    <div class="docs__body">
      <vd-sidebar
        :model-value="route.path"
        :permanent="isDesktop"
        :open="drawer"
        :class="{ docs__sidebar: isDesktop }"
        @update:open="drawer = $event"
        @update:model-value="drawer = false"
      >
        <template v-if="!isDesktop" #logo>
          <vd-icon icon="feather" color="primary" size="medium" />
        </template>

        <vd-sidebar-group v-for="section in nav" :key="section.title" open>
          <template #header>
            <vd-sidebar-item>{{ section.title }}</vd-sidebar-item>
          </template>
          <vd-sidebar-item v-for="item in section.items" :id="item.to" :key="item.to" :to="item.to">
            {{ item.title }}
          </vd-sidebar-item>
        </vd-sidebar-group>
      </vd-sidebar>

      <main class="docs__main">
        <article class="docs__content markdown-body">
          <router-view />
        </article>
      </main>
    </div>
  </div>
</template>
