<template>
  <div class="scroller">
    <p class="spacer">Scroll this panel to see the image drift.</p>
    <f-parallax
      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=60"
      :height="260"
      :scale="0.3"
    />
    <p class="spacer">The image moves more slowly than the page around it.</p>
  </div>
</template>

<style scoped>
.scroller {
  max-height: 380px;
  overflow-y: auto;
}
.spacer {
  padding: 48px 8px;
  opacity: 0.7;
}
</style>
