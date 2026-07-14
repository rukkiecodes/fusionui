<template>
  <div class="row">
    <f-icon-btn icon="zap" aria-label="Run now" color="primary" />
    <f-icon-btn icon="check" aria-label="Approve" color="success" />
    <f-icon-btn icon="x" aria-label="Reject" color="danger" />
    <f-icon-btn icon="alert-triangle" aria-label="Report a problem" color="warning" />
    <f-icon-btn icon="moon" aria-label="Switch to dark mode" color="dark" />
    <f-icon-btn icon="star" aria-label="Add to favourites" color="#6d28d9" />
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
