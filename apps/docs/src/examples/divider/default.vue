<template>
  <div class="panel">
    <section class="section">
      <h4 class="heading">Billing</h4>
      <p class="body">Your plan renews on 1 August and covers 12 seats.</p>
    </section>

    <f-divider />

    <section class="section">
      <h4 class="heading">Payment method</h4>
      <p class="body">Visa ending in 4242, expires 09/28.</p>
    </section>
  </div>
</template>

<style scoped>
.panel {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
.section {
  padding: 16px 0;
}
.heading {
  margin: 0 0 4px;
  font-size: 0.95rem;
}
.body {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
