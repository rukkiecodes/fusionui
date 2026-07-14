<template>
  <div class="stack">
    <f-footer color="primary" rounded>
      <span>Built with FusionUI</span>
      <f-spacer />
      <nav class="links">
        <a href="#">Docs</a>
        <a href="#">GitHub</a>
      </nav>
    </f-footer>

    <f-footer color="dark" rounded>
      <span>© 2026 Orbit Labs</span>
      <f-spacer />
      <nav class="links">
        <a href="#">Careers</a>
        <a href="#">Contact</a>
      </nav>
    </f-footer>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.links {
  display: flex;
  gap: 20px;
}
</style>
