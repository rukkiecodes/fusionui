<script setup lang="ts">
import { computed, onBeforeUnmount, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@rukkiecodes/vue'
import { nav, WEB_DOCS_URL } from './nav'
import { highlightMarkdown } from './prism'

const theme = useTheme()
const route = useRoute()
const drawer = ref(false)

const logoUrl = new URL('../public/logo.svg', import.meta.url).href
const isHome = computed(() => route.path === '/')

// Re-highlight fenced code after each navigation (markdown emits plain text).
watch(
  () => route.fullPath,
  () => nextTick(() => requestAnimationFrame(() => highlightMarkdown())),
  { immediate: true }
)

const media = typeof window !== 'undefined' ? window.matchMedia('(min-width: 880px)') : null
const isDesktop = ref(media?.matches ?? true)
const onMedia = (e: MediaQueryListEvent) => (isDesktop.value = e.matches)
media?.addEventListener('change', onMedia)
onBeforeUnmount(() => media?.removeEventListener('change', onMedia))
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
          <img :src="logoUrl" alt="" class="docs__logo" width="26" height="26" />
          <strong>FusionUI</strong>
          <span class="docs__brand-tag">Mobile</span>
        </router-link>
      </template>
      <template #right>
        <f-btn
          variant="text"
          size="small"
          append-icon="arrow-up-right"
          :href="WEB_DOCS_URL"
          class="docs__web-link"
        >
          Web docs
        </f-btn>
        <f-btn
          variant="text"
          :icon="theme.isDark.value ? 'sun' : 'moon'"
          :aria-label="theme.isDark.value ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="theme.toggle()"
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
        :permanent="isDesktop && !isHome"
        :open="drawer"
        :class="{ docs__sidebar: isDesktop && !isHome }"
        @update:open="drawer = $event"
        @update:model-value="drawer = false"
      >
        <template v-if="!isDesktop" #logo>
          <img :src="logoUrl" alt="" class="docs__logo" width="24" height="24" />
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

      <main class="docs__main" :class="{ 'docs__main--landing': isHome }">
        <router-view v-if="isHome" />
        <article v-else class="docs__content markdown-body">
          <router-view />
        </article>
      </main>
    </div>
  </div>
</template>

<style scoped>
.docs__brand-tag {
  margin-left: 2px;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgb(var(--fui-theme-primary));
  background: rgba(var(--fui-theme-primary), 0.12);
}
.docs__web-link {
  margin-right: 2px;
}
@media (max-width: 640px) {
  .docs__web-link {
    display: none;
  }
}
</style>
