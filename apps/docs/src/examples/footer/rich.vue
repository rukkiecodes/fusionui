<template>
  <f-footer border rounded class="rich">
    <div class="columns">
      <div class="brand">
        <strong>Orbit</strong>
        <p>Deploy, observe and roll back — from one dashboard.</p>
      </div>

      <div class="links">
        <span class="heading">Product</span>
        <a href="#">Changelog</a>
        <a href="#">Pricing</a>
        <a href="#">Roadmap</a>
      </div>

      <div class="links">
        <span class="heading">Company</span>
        <a href="#">About</a>
        <a href="#">Careers</a>
        <a href="#">Contact</a>
      </div>
    </div>

    <f-divider />

    <div class="bar">
      <span>© 2026 Orbit Labs</span>
      <f-spacer />
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </f-footer>
</template>

<style scoped>
.rich {
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  width: 100%;
}

.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 24px;
  width: 100%;
}

.brand p {
  margin: 8px 0 0;
  opacity: 0.7;
  width: 100%;
  max-width: 28ch;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.heading {
  font-weight: 600;
  margin-bottom: 2px;
}

.bar {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}
</style>
