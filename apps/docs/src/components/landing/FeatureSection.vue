<script setup lang="ts">
import LandingArt from './LandingArt.vue'

import { computed } from 'vue'

// The alternating art/copy band from the Vuesax landing, rebuilt: art on one side,
// copy and a call to action on the other, flipping each time down the page.
const props = defineProps<{
  art: 'tokens' | 'glass' | 'a11y' | 'platforms'
  eyebrow: string
  /** The word(s) to paint with the brand gradient are wrapped in *asterisks*. */
  title: string
  body: string
  to: string
  cta: string
  /** Put the art on the right instead of the left. */
  flip?: boolean
}>()

// The gradient word is marked with *asterisks* and split into real nodes, rather
// than passed as a chunk of HTML to v-html. Same output, no injection surface.
const titleParts = computed(() =>
  props.title.split(/\*([^*]+)\*/g).map((text, i) => ({ text, em: i % 2 === 1 }))
)

// `to` may be an in-app route or an absolute URL (e.g. the separate mobile docs).
const isExternal = computed(() => /^https?:\/\//.test(props.to))
</script>

<template>
  <section class="feat" :class="{ 'feat--flip': flip }">
    <div class="feat__art">
      <LandingArt :name="art" />
    </div>

    <div class="feat__copy">
      <p class="feat__eyebrow">{{ eyebrow }}</p>
      <h2 class="feat__title">
        <template v-for="(part, i) in titleParts" :key="i">
          <b v-if="part.em">{{ part.text }}</b>
          <template v-else>{{ part.text }}</template>
        </template>
      </h2>
      <p class="feat__body">{{ body }}</p>
      <f-btn
        v-if="isExternal"
        color="primary"
        variant="tonal"
        append-icon="arrow-up-right"
        :href="to"
      >
        {{ cta }}
      </f-btn>
      <RouterLink v-else v-slot="{ href, navigate }" :to="to" custom>
        <f-btn
          color="primary"
          variant="tonal"
          append-icon="arrow-right"
          :href="href"
          @click="navigate"
        >
          {{ cta }}
        </f-btn>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.feat {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 64px;
  padding: 88px 0;
}
.feat--flip .feat__art {
  order: 2;
}

.feat__art {
  display: flex;
  justify-content: center;
}

.feat__eyebrow {
  margin: 0 0 10px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgb(var(--fui-theme-primary));
}
.feat__title {
  margin: 0 0 14px;
  font-size: clamp(1.6rem, 2.6vw, 2.3rem);
  line-height: 1.18;
  letter-spacing: -0.025em;
  text-wrap: balance;
}
.feat__title b {
  background: linear-gradient(
    100deg,
    rgb(var(--fui-theme-primary)),
    rgb(var(--fui-theme-secondary))
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: inherit;
}
.feat__body {
  margin: 0 0 26px;
  max-width: 48ch;
  font-size: 1.02rem;
  line-height: 1.68;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}

@media (max-width: 900px) {
  .feat {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 56px 0;
    text-align: center;
  }
  /* On one column the art always leads, whichever side it sat on. */
  .feat--flip .feat__art {
    order: 0;
  }
  .feat__body {
    margin-inline: auto;
  }
}
</style>
