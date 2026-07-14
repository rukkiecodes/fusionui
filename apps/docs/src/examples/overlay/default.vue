<template>
  <f-overlay>
    <template #activator="{ props }">
      <f-btn v-bind="props" color="primary" prepend-icon="image">Open preview</f-btn>
    </template>

    <template #default="{ close }">
      <figure class="lightbox">
        <img src="https://picsum.photos/id/1015/960/600" alt="A river running between cliffs" />
        <figcaption>
          <span>Rocky river, Oregon</span>
          <f-btn icon="x" variant="text" size="small" @click="close" />
        </figcaption>
      </figure>
    </template>
  </f-overlay>
</template>

<style scoped>
.lightbox {
  margin: 0;
  width: 100%;
  max-width: min(720px, 100%);
  border-radius: var(--fui-radius-lg);
  overflow: hidden;
  background: rgb(var(--fui-theme-surface));
}
.lightbox img {
  display: block;
  width: 100%;
  height: auto;
}
figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 10px 10px 16px;
  font-size: 0.9rem;
}
</style>
