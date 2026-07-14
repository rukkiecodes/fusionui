<script setup>
import { ref } from 'vue'

const tab = ref('overview')
const section = ref('reports')
</script>

<template>
  <!-- The chrome pins itself to the viewport in a real app; the wrapper below
       only exists to trap it inside this docs page. -->
  <div class="shell">
    <f-layout>
      <f-navbar v-model="tab" square not-line>
        <template #left>
          <f-icon icon="feather" color="primary" />
          <strong style="margin-left: 6px">Acme</strong>
        </template>

        <f-navbar-item id="overview">Overview</f-navbar-item>
        <f-navbar-item id="usage">Usage</f-navbar-item>

        <template #right>
          <f-avatar text="TA" size="small" />
        </template>
      </f-navbar>

      <f-sidebar v-model="section" permanent :width="180">
        <f-sidebar-item id="reports">
          <template #icon><f-icon icon="bar-chart-2" size="small" /></template>
          Reports
        </f-sidebar-item>
        <f-sidebar-item id="customers">
          <template #icon><f-icon icon="users" size="small" /></template>
          Customers
        </f-sidebar-item>
        <f-sidebar-item id="billing">
          <template #icon><f-icon icon="credit-card" size="small" /></template>
          Billing
        </f-sidebar-item>

        <template #footer>
          <f-sidebar-item id="settings">
            <template #icon><f-icon icon="settings" size="small" /></template>
            Settings
          </f-sidebar-item>
        </template>
      </f-sidebar>

      <f-main>
        <div class="page">
          <h3 class="page__title">{{ section }}</h3>
          <p class="page__text">
            <code>f-main</code> is inset by the navbar's measured height, the sidebar's width and
            the footer's height — no padding of your own.
          </p>
          <div class="page__grid">
            <div v-for="n in 4" :key="n" class="page__tile" />
          </div>
        </div>
      </f-main>

      <f-footer app>
        <span class="foot">© Acme</span>
      </f-footer>

      <f-fab app icon="plus" location="bottom end" />
    </f-layout>
  </div>
</template>

<style scoped>
.shell {
  position: relative;
  width: 100%;
  height: 440px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
}

/* In an app the layout fills the viewport and its items are `fixed`. Inside the
   docs they are pinned to this box instead — nothing here is needed in yours. */
.shell :deep(.fui-layout) {
  height: 100%;
  min-height: 0;
}

.shell :deep(.fui-main) {
  height: 100%;
  min-height: 0;
  overflow: auto;
}

.shell :deep(.fui-navbar),
.shell :deep(.fui-sidebar),
.shell :deep(.fui-footer),
.shell :deep(.fui-fab) {
  position: absolute !important;
}

.page {
  padding: 20px;
}

.page__title {
  margin: 0 0 6px;
  font-size: 1.05rem;
  text-transform: capitalize;
}

.page__text {
  margin: 0 0 16px;
  font-size: 0.85rem;
  color: rgba(var(--fui-theme-on-surface), 0.6);
}

.page__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.page__tile {
  height: 90px;
  border-radius: var(--fui-radius-lg);
  background: rgba(var(--fui-theme-on-surface), 0.05);
}

.foot {
  font-size: 0.78rem;
  opacity: 0.7;
}

code {
  font-family: var(--fui-font-family-mono);
}
</style>
