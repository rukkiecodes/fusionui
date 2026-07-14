<template>
  <div class="row">
    <f-hover v-slot="{ isHovering, props }">
      <f-card
        v-bind="props"
        :elevation="isHovering ? 12 : 2"
        class="card"
        :class="{ 'card--up': isHovering }"
      >
        <f-card-title>Analytics</f-card-title>
        <f-card-text>
          {{ isHovering ? 'Release to open' : 'Hover me' }}
        </f-card-text>
      </f-card>
    </f-hover>

    <f-hover v-slot="{ isHovering, props }" :open-delay="200">
      <f-btn v-bind="props" :color="isHovering ? 'success' : 'primary'">
        {{ isHovering ? 'Ready' : 'Hover (200ms delay)' }}
      </f-btn>
    </f-hover>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.card {
  width: 220px;
  transition: transform 0.2s ease;
}
.card--up {
  transform: translateY(-4px);
}
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
  .card--up {
    transform: none;
  }
}
</style>
