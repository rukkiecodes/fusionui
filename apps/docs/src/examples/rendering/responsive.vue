<template>
  <div class="row">
    <f-responsive aspect-ratio="16/9" :width="280" class="box">
      <div class="fill">16 / 9</div>
    </f-responsive>

    <f-responsive aspect-ratio="1" :width="160" class="box">
      <div class="fill">1 / 1</div>
    </f-responsive>

    <f-responsive aspect-ratio="4/3" :width="200" class="box">
      <div class="fill">4 / 3</div>
    </f-responsive>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.box {
  border-radius: 12px;
  overflow: hidden;
}
.fill {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: rgb(var(--fui-theme-primary) / 12%);
  color: rgb(var(--fui-theme-primary));
  font-weight: 600;
}
</style>
