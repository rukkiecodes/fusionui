<template>
  <div class="motion">
    <div class="tiles">
      <div class="tile tile--lift">hover to lift</div>
      <div class="tile tile--sink">press to sink</div>
    </div>

    <div class="buttons">
      <f-btn>elevated</f-btn>
      <f-btn variant="gradient">gradient</f-btn>
      <f-btn variant="relief" color="success">relief</f-btn>
      <f-btn variant="line" color="danger">line</f-btn>
    </div>
  </div>
</template>

<style scoped>
.motion {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tiles,
.buttons {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 76px;
  border-radius: var(--fui-radius-md);
  background-color: rgb(var(--fui-surface-2));
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity));
  box-shadow: var(--fui-elevation-3);
  font-size: 13px;
  cursor: pointer;
  user-select: none;

  /* The heartbeat: all 0.25s ease. */
  transition: var(--fui-transition);
}

/* The Vuesax lift — rise -3px, cast a bigger soft shadow. */
.tile--lift:hover {
  transform: translateY(-3px);
  box-shadow: var(--fui-elevation-6);
}

/* …and the sink: 3px down, shadow collapses. */
.tile--sink:active {
  transform: translateY(3px);
  box-shadow: var(--fui-elevation-1);
}

/* The reduced-motion path. The movement goes; the state stays legible. */
@media (prefers-reduced-motion: reduce) {
  .tile {
    transition: none;
  }
  .tile--lift:hover {
    transform: none;
    box-shadow: var(--fui-elevation-6);
  }
  .tile--sink:active {
    transform: none;
    box-shadow: var(--fui-elevation-1);
  }
}
</style>
