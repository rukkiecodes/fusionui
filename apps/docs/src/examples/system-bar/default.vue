<template>
  <div class="frame">
    <f-system-bar>
      <f-icon icon="git-branch" size="x-small" />
      <span>main</span>
      <f-spacer />
      <span>Build #2418</span>
    </f-system-bar>

    <div class="body">Page content sits below the bar.</div>
  </div>
</template>

<style scoped>
.frame {
  border: 1px solid rgb(var(--fui-theme-on-surface) / 12%);
  border-radius: 12px;
  overflow: hidden;
}
.body {
  padding: 24px;
}
</style>
