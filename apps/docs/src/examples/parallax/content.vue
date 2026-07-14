<template>
  <f-parallax
    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=60"
    :height="300"
  >
    <div class="hero">
      <h2 class="hero__title">Ship faster</h2>
      <p class="hero__sub">One design language, every Vue project you own.</p>
      <f-btn color="primary" variant="elevated">Get started</f-btn>
    </div>
  </f-parallax>
</template>

<style scoped>
.hero {
  text-align: center;
  color: #fff;
  padding: 24px;
  text-shadow: 0 2px 12px rgb(0 0 0 / 55%);
}
.hero__title {
  margin: 0 0 8px;
  font-size: 2rem;
}
.hero__sub {
  margin: 0 0 20px;
  opacity: 0.9;
}
</style>
