<template>
  <f-card class="card">
    <f-card-text>
      <f-no-ssr>
        <template #placeholder>
          <f-skeleton type="text" />
        </template>

        <!--
          The visitor's own locale and timezone only exist on the client — rendering
          this on the server would produce a different string and break hydration.
        -->
        <p class="local">
          Your local time is
          <strong>{{ new Date().toLocaleTimeString() }}</strong>
        </p>
      </f-no-ssr>
    </f-card-text>
  </f-card>
</template>

<style scoped>
.card {
  width: 100%;
  max-width: 360px;
}
.local {
  margin: 0;
}
</style>
