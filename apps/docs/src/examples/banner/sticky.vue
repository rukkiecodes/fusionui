<template>
  <div class="scroller">
    <f-banner
      sticky
      bg-color="dark"
      icon="wifi"
      text="You are offline. Changes are saved locally and will sync when you reconnect."
    />

    <div class="page">
      <p v-for="n in 6" :key="n">
        Scroll the panel — the banner stays pinned to the top of its scroll container while the
        release notes move underneath it.
      </p>
    </div>
  </div>
</template>

<style scoped>
.scroller {
  height: 220px;
  overflow-y: auto;
  border-radius: 12px;
  border: thin solid rgba(var(--fui-theme-on-surface), 0.12);
}

.page {
  padding: 16px 20px;
}

.page p {
  margin: 0 0 16px;
  line-height: 1.6;
}
</style>
