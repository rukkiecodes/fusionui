<script setup lang="ts">
// One page per copy-in component, driven by the real registry. It shows what the
// component is, the `add` command that copies it into your project, the packages to
// install, its props, a usage snippet, and a live preview of the actual component.
import { computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findComponent, installCommand } from '@/registry'
import CommandBlock from '@/components/CommandBlock.vue'
import PreviewShell from '@/components/PreviewShell.vue'
import InlineCode from '@/components/InlineCode.vue'
import { highlightMarkdown } from '@/prism'

const route = useRoute()
const doc = computed(() => findComponent(String(route.params.slug)))
const install = computed(() => (doc.value ? installCommand(doc.value) : ''))

watch(
  () => route.params.slug,
  () => nextTick(() => requestAnimationFrame(() => highlightMarkdown())),
  { immediate: true }
)
onMounted(() => nextTick(() => requestAnimationFrame(() => highlightMarkdown())))
</script>

<template>
  <div v-if="doc" class="cmp">
    <header class="cmp__head">
      <p class="cmp__eyebrow">{{ doc.category }}</p>
      <h1 class="cmp__title">{{ doc.title }}</h1>
      <p class="cmp__desc"><InlineCode :text="doc.description" /></p>
    </header>

    <PreviewShell :slug="doc.slug" :snack-id="doc.snackId" />

    <section v-if="install" class="cmp__install">
      <CommandBlock label="Install its dependencies" :command="install" />
    </section>

    <section v-if="doc.usage" class="cmp__usage">
      <h2>Usage</h2>
      <pre><code class="language-tsx">{{ doc.usage }}</code></pre>
    </section>

    <section v-if="doc.api.length" class="cmp__api">
      <h2>Props</h2>
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
  margin-bottom: 22px;
}
.cmp__eyebrow {
  margin: 0 0 6px;
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.76rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgb(var(--fui-theme-primary));
}
.cmp__title {
  margin: 0;
  font-size: clamp(1.9rem, 4vw, 2.5rem);
  letter-spacing: -0.03em;
}
.cmp__desc {
  margin: 12px 0 0;
  max-width: 65ch;
  font-size: 1.02rem;
  line-height: 1.6;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.72));
}
.cmp__install {
  margin: 0 0 20px;
}
.cmp__api,
.cmp__usage {
  margin: 30px 0 0;
}
.cmp__api h2,
.cmp__usage h2 {
  font-size: 1.15rem;
  margin: 0 0 12px;
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
</style>
