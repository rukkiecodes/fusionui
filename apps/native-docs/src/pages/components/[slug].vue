<script setup lang="ts">
// One page per @rukkiecodes/native component — data-driven from the manifest. Each
// variant renders its own live Expo Snack. Adding a component/variant is a registry
// edit; this page renders whatever the manifest carries.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findComponent } from '@/manifest'
import NativeSnack from '@/components/NativeSnack.vue'
import InlineCode from '@/components/InlineCode.vue'

const route = useRoute()
const doc = computed(() => findComponent(String(route.params.slug)))
</script>

<template>
  <div v-if="doc" class="cmp">
    <header class="cmp__head">
      <p class="cmp__eyebrow">
        {{ doc.category }}
        <span v-if="doc.web" class="cmp__web"
          >· web <code>{{ doc.web }}</code></span
        >
      </p>
      <h1 class="cmp__title">
        {{ doc.title }} <span class="cmp__name">{{ doc.component }}</span>
      </h1>
      <p class="cmp__desc"><InlineCode :text="doc.description" /></p>
    </header>

    <section v-if="doc.api.length" class="cmp__api">
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in doc.api" :key="row.prop">
            <td>
              <code>{{ row.prop }}</code>
            </td>
            <td class="cmp__type">{{ row.type }}</td>
            <td>
              <code v-if="row.default && row.default !== '—'">{{ row.default }}</code>
              <span v-else>—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-for="v in doc.variants" :id="v.id" :key="v.id" class="cmp__variant">
      <h2 class="cmp__variant-title">{{ v.title }}</h2>
      <p v-if="v.blurb" class="cmp__variant-blurb">{{ v.blurb }}</p>
      <NativeSnack :name="v.snack" :deps="v.deps" :height="v.height" />
    </section>
  </div>

  <div v-else class="cmp cmp--missing">
    <h1>Component not found</h1>
    <p>
      No component matches “{{ route.params.slug }}”.
      <RouterLink to="/components">Browse all components →</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.cmp__head {
  margin-bottom: 28px;
}
.cmp__eyebrow {
  margin: 0 0 6px;
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.76rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: rgb(var(--fui-theme-primary));
}
.cmp__web {
  color: rgba(var(--fui-theme-on-surface), 0.5);
}
.cmp__title {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  letter-spacing: -0.03em;
}
.cmp__name {
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 8px;
  color: rgb(var(--fui-theme-primary));
  background: rgba(var(--fui-theme-primary), 0.1);
}
.cmp__desc {
  margin: 14px 0 0;
  max-width: 65ch;
  font-size: 1.02rem;
  line-height: 1.6;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.72));
}
.cmp__api {
  margin: 0 0 34px;
  overflow-x: auto;
}
.cmp__api table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.cmp__api th,
.cmp__api td {
  text-align: left;
  padding: 9px 12px;
  border-bottom: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
}
.cmp__api th {
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(var(--fui-theme-on-surface), 0.5);
}
.cmp__type {
  color: rgba(var(--fui-theme-on-surface), 0.7);
}
.cmp__variant {
  margin: 0 0 40px;
  scroll-margin-top: 80px;
}
.cmp__variant-title {
  margin: 0 0 4px;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}
.cmp__variant-blurb {
  margin: 0 0 4px;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.66));
}
</style>
