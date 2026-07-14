<template>
  <div class="row">
    <f-empty-state
      icon="search"
      title="No results for “invoice 4021”"
      text="Check the spelling or search by customer name instead."
    />
    <f-empty-state
      icon="wifi-off"
      title="You're offline"
      text="We'll sync your changes as soon as the connection is back."
    />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
