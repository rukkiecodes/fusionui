<template>
  <f-defaults-provider :defaults="{ FBtn: { variant: 'tonal', color: 'success' } }">
    <div class="stack">
      <div class="row">
        <span class="tag">outer</span>
        <f-btn>Deploy</f-btn>
      </div>

      <f-defaults-provider :defaults="{ FBtn: { color: 'warning' } }">
        <div class="row">
          <span class="tag">nested</span>
          <f-btn>Deploy</f-btn>
          <span class="note">inherits <code>variant: tonal</code>, overrides the color</span>
        </div>
      </f-defaults-provider>

      <f-defaults-provider scoped :defaults="{ FBtn: { color: 'warning' } }">
        <div class="row">
          <span class="tag">scoped</span>
          <f-btn>Deploy</f-btn>
          <span class="note">inherits nothing — variant falls back to FBtn's own default</span>
        </div>
      </f-defaults-provider>

      <f-defaults-provider disabled :defaults="{ FBtn: { color: 'danger' } }">
        <div class="row">
          <span class="tag">disabled</span>
          <f-btn>Deploy</f-btn>
          <span class="note">its own defaults are ignored; the outer ones still apply</span>
        </div>
      </f-defaults-provider>
    </div>
  </f-defaults-provider>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  width: 64px;
  font-size: 0.72rem;
  color: rgba(var(--fui-theme-on-surface), 0.5);
}

.note {
  font-size: 0.72rem;
  color: rgba(var(--fui-theme-on-surface), 0.45);
}

code {
  font-family: var(--fui-font-family-mono);
}
</style>
