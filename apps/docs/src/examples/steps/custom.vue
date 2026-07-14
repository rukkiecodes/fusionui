<template>
  <f-steps>
    <article class="step">
      <f-chip size="small" color="primary">Step 1</f-chip>
      <h3>Import your data</h3>
      <p>Upload a CSV or point us at your database — we map the columns for you.</p>
      <f-btn variant="text" size="small" append-icon="arrow-right">Import guide</f-btn>
    </article>

    <article class="step">
      <f-chip size="small" color="primary">Step 2</f-chip>
      <h3>Build a report</h3>
      <p>Drag fields onto the canvas and the chart updates as you go.</p>
      <f-btn variant="text" size="small" append-icon="arrow-right">Report gallery</f-btn>
    </article>

    <article class="step">
      <f-chip size="small" color="primary">Step 3</f-chip>
      <h3>Share it</h3>
      <p>Send a link, schedule an email, or embed the report in your own app.</p>
      <f-btn variant="text" size="small" append-icon="arrow-right">Sharing options</f-btn>
    </article>
  </f-steps>
</template>

<style scoped>
.step {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 24px 22px;
  border: 1px solid rgba(var(--fui-theme-on-background), 0.1);
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
}
.step h3 {
  margin: 0;
  font-size: 1.05rem;
}
.step p {
  margin: 0;
  opacity: 0.7;
  line-height: 1.5;
}
</style>
