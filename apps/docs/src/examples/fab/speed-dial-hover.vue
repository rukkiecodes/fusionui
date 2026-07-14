<template>
  <!-- Fans downward, and the pointer only has to hover the FAB to open it. -->
  <f-speed-dial open-on-hover location="bottom" :offset="16" label="Share this page">
    <template #activator="{ props: activator }">
      <f-fab v-bind="activator" extended icon="share-2" text="Share" color="dark" />
    </template>

    <f-btn icon="mail" circle size="small" color="primary" aria-label="Share by email" />
    <f-btn icon="link" circle size="small" color="success" aria-label="Copy link" />
    <f-btn icon="twitter" circle size="small" color="#1d9bf0" aria-label="Share on X" />
  </f-speed-dial>
</template>
