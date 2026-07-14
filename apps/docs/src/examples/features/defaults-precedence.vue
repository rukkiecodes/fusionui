<template>
  <div class="stack">
    <div class="row">
      <span class="tag">component</span>
      <f-btn>Deploy</f-btn>
      <span class="note">no default anywhere — <code>elevated</code>, <code>primary</code></span>
    </div>

    <!-- Stands in for `createFusionUI({ defaults })`: the two layers behave
         identically, this one is just scoped to the box. -->
    <f-defaults-provider :defaults="{ global: { size: 'small' } }">
      <div class="row">
        <span class="tag">global</span>
        <f-btn>Deploy</f-btn>
        <span class="note"><code>size: small</code> reaches every component with a size</span>
      </div>

      <f-defaults-provider :defaults="{ FBtn: { variant: 'tonal', color: 'success' } }">
        <div class="row">
          <span class="tag">per&#8209;component</span>
          <f-btn>Deploy</f-btn>
          <span class="note">still small — the inner provider merges over the outer</span>
        </div>

        <f-defaults-provider :defaults="{ FBtn: { color: 'warning' } }">
          <div class="row">
            <span class="tag">nested</span>
            <f-btn>Deploy</f-btn>
            <span class="note">keeps <code>tonal</code> and <code>small</code>, recolors</span>
          </div>
        </f-defaults-provider>

        <div class="row">
          <span class="tag">prop</span>
          <f-btn variant="flat" color="danger" size="default">Deploy</f-btn>
          <span class="note">an explicit prop always wins</span>
        </div>
      </f-defaults-provider>
    </f-defaults-provider>
  </div>
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
  min-height: 34px;
}

.tag {
  width: 96px;
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
