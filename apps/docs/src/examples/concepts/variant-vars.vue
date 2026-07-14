<template>
  <div class="cols">
    <div class="col">
      <span class="head">color="danger"</span>
      <f-btn variant="outlined" color="danger" active>Delete</f-btn>
      <p class="note">
        The button owns both halves of the pair, so the filled state flips the label to
        <code>--fui-variant-on</code>.
      </p>
    </div>

    <div class="col">
      <span class="head">class="text-danger"</span>
      <f-btn variant="outlined" class="text-danger" active>Delete</f-btn>
      <p class="note">
        The utility is <code>!important</code> in the last layer, so the label stays red on top of
        the primary fill the component painted underneath.
      </p>
    </div>
  </div>
</template>

<style scoped>
.cols {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  width: 100%;
}
.col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  max-width: 260px;
}
.head {
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.8rem;
  opacity: 0.6;
}
.note {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
.note code {
  font-family: var(--fui-font-family-mono, monospace);
}
</style>
