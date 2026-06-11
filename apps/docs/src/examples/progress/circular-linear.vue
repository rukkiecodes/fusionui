<template>
  <div class="d-flex" style="gap: 24px; align-items: center; flex-wrap: wrap">
    <vd-progress-circular indeterminate color="primary" />
    <vd-progress-circular :model-value="66" color="success" :size="48" />
    <div style="flex: 1 1 200px">
      <vd-progress-linear :model-value="40" color="primary" />
    </div>
    <div style="flex: 1 1 200px">
      <vd-progress-linear indeterminate color="success" />
    </div>
  </div>
</template>
