<template>
  <div class="row">
    <f-icon-btn icon="heart" aria-label="Like this post" color="danger" />
    <f-icon-btn icon="bookmark" aria-label="Save for later" />
    <f-icon-btn icon="share-2" aria-label="Share" color="success" />
    <f-icon-btn icon="trash-2" aria-label="Delete" variant="tonal" color="danger" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
