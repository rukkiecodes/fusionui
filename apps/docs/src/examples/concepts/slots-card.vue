<script setup>
const img = name => `${import.meta.env.BASE_URL}cards/${name}`
</script>

<template>
  <div class="cols">
    <!-- Named slots: FCard wraps each one in the element it needs. -->
    <f-card class="card">
      <template #img><img :src="img('foto5.png')" alt="" /></template>
      <template #title><h3>Named slots</h3></template>
      <template #text>
        <p>
          <code>#img</code>, <code>#title</code>, <code>#text</code> and <code>#buttons</code> each
          land in their own wrapper, so the layout holds without extra markup.
        </p>
      </template>
      <template #buttons>
        <f-btn variant="text" size="small">Share</f-btn>
        <f-btn variant="text" size="small">Save</f-btn>
      </template>
    </f-card>

    <!-- The same regions, as sub-components inside the default slot. -->
    <f-card class="card">
      <f-card-title><h3>Sub-components</h3></f-card-title>
      <f-card-text>
        <p>
          <code>FCardTitle</code>, <code>FCardText</code> and <code>FCardButtons</code> render the
          identical wrappers. Reach for them when the content is composed further down the tree than
          a slot can see.
        </p>
      </f-card-text>
      <f-card-buttons>
        <f-btn variant="text" size="small">Share</f-btn>
        <f-btn variant="text" size="small">Save</f-btn>
      </f-card-buttons>
    </f-card>
  </div>
</template>

<style scoped>
.cols {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  width: 100%;
}
.card {
  width: 280px;
}
h3 {
  margin: 0;
  font-size: 1rem;
}
p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}
code {
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.85em;
}
</style>
