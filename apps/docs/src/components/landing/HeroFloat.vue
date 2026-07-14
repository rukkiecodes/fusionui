<script setup lang="ts">
import { ref } from 'vue'

// The hero's right-hand side: real FusionUI components, floating, each one a link
// into its own documentation page. Nothing here is a screenshot or a mock — every
// tile is the shipped component, running the code a consumer installs. That is the
// whole argument the page is making, so it had better be literally true.
//
// Each tile drifts on its own loop (offset delay + duration, so they never move in
// lockstep). Hovering lifts it out of the pile: scale up, raise the z-index above
// every sibling, deepen the shadow.

interface Tile {
  id: string
  /** Where clicking it goes. */
  to: string
  /** Spoken name — the tile's content is decorative to a screen reader. */
  label: string
  /** Position within the 560×620 stage, and the float timing. */
  style: Record<string, string>
}

const tiles: Tile[] = [
  { id: 'card', to: '/components/card', label: 'Card', style: pos(0, 8, 17, 0) },
  { id: 'buttons', to: '/components/button', label: 'Buttons', style: pos(300, 0, 15, 1.2) },
  { id: 'switch', to: '/components/switch', label: 'Switch', style: pos(18, 300, 19, 0.4) },
  { id: 'input', to: '/components/inputs', label: 'Text input', style: pos(215, 250, 16, 2.1) },
  { id: 'avatar', to: '/components/avatar', label: 'Avatar group', style: pos(430, 250, 18, 0.8) },
  { id: 'rating', to: '/components/rating', label: 'Rating', style: pos(140, 60, 21, 2.8) },
  { id: 'chips', to: '/components/chip', label: 'Chips', style: pos(392, 30, 16, 1.7) },
  { id: 'alert', to: '/components/alert', label: 'Alert', style: pos(520, 60, 20, 0.2) },
  { id: 'progress', to: '/components/loading', label: 'Progress', style: pos(120, 420, 17, 2.4) },
  { id: 'slider', to: '/components/slider', label: 'Slider', style: pos(330, 430, 19, 1) },
  { id: 'badge', to: '/components/badge', label: 'Badge', style: pos(0, 470, 15, 3.1) },
]

function pos(top: number, left: number, seconds: number, delay: number) {
  return {
    top: `${top}px`,
    left: `${left}px`,
    '--float-duration': `${seconds}s`,
    '--float-delay': `${delay}s`,
  }
}

// Live state, so the components are genuinely interactive if you poke them.
const notify = ref(true)
const email = ref('')
const rating = ref(4)
const volume = ref(62)
</script>

<template>
  <div class="stage" aria-label="FusionUI components — each links to its documentation">
    <RouterLink
      v-for="tile in tiles"
      :key="tile.id"
      :to="tile.to"
      class="tile"
      :class="`tile--${tile.id}`"
      :style="tile.style"
      :aria-label="`${tile.label} — read the docs`"
    >
      <!-- The float lives on its own element so it doesn't fight the hover scale;
           see the note in the stylesheet.
           The component inside is decoration for assistive tech: the link already
           carries the name, and a nested control would be a focus trap in a link. -->
      <div class="tile__float">
        <div class="tile__inner" aria-hidden="true">
          <template v-if="tile.id === 'card'">
            <f-card class="mini-card">
              <f-card-title>Weekly report</f-card-title>
              <f-card-text>Signups are up 24% on last week.</f-card-text>
              <f-card-buttons>
                <f-btn variant="text" size="small">Dismiss</f-btn>
                <f-btn color="primary" size="small">Open</f-btn>
              </f-card-buttons>
            </f-card>
          </template>

          <template v-else-if="tile.id === 'buttons'">
            <div class="row">
              <f-btn color="primary">Primary</f-btn>
              <f-btn color="secondary" variant="gradient">Gradient</f-btn>
            </div>
            <div class="row">
              <f-btn color="success" variant="tonal" size="small">Tonal</f-btn>
              <f-btn color="danger" variant="outlined" size="small">Outlined</f-btn>
            </div>
          </template>

          <template v-else-if="tile.id === 'switch'">
            <f-switch v-model="notify" color="primary">Notifications</f-switch>
            <f-switch :model-value="false" color="success">Weekly digest</f-switch>
          </template>

          <template v-else-if="tile.id === 'input'">
            <f-input
              v-model="email"
              label="Email"
              placeholder="you@company.com"
              prepend-icon="mail"
              block
            />
          </template>

          <template v-else-if="tile.id === 'avatar'">
            <f-avatar-group max="4">
              <f-avatar image="https://i.pravatar.cc/80?img=15" />
              <f-avatar image="https://i.pravatar.cc/80?img=32" />
              <f-avatar image="https://i.pravatar.cc/80?img=48" />
              <f-avatar text="Lana Steiner" color="primary" />
              <f-avatar text="Demi Wilkinson" color="success" />
            </f-avatar-group>
          </template>

          <template v-else-if="tile.id === 'rating'">
            <f-rating v-model="rating" hover aria-label="Rating" />
          </template>

          <template v-else-if="tile.id === 'chips'">
            <div class="row">
              <f-chip color="primary">Design</f-chip>
              <f-chip color="success">Shipped</f-chip>
              <f-chip color="danger" variant="outlined">Blocked</f-chip>
            </div>
          </template>

          <template v-else-if="tile.id === 'alert'">
            <f-alert color="success" variant="tonal" prepend-icon="check-circle">
              Deployed to production
            </f-alert>
          </template>

          <template v-else-if="tile.id === 'progress'">
            <f-progress-circular :model-value="72" color="primary" size="52" />
            <f-progress-linear :model-value="72" color="primary" />
          </template>

          <template v-else-if="tile.id === 'slider'">
            <f-slider v-model="volume" color="primary" />
          </template>

          <template v-else-if="tile.id === 'badge'">
            <f-badge :content="8" color="danger">
              <f-icon icon="bell" size="large" />
            </f-badge>
          </template>
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  width: 620px;
  height: 620px;
  flex: 0 0 auto;
}

/*
 * The drift and the hover-scale are on SEPARATE elements on purpose.
 *
 * Both want to write `transform`, and a CSS animation always beats a normal
 * declaration — so with the float keyframes on the same element, the hover
 * `scale()` was silently dropped and the tile only ever translated. Pausing the
 * animation does not help: a paused animation still holds its computed transform.
 *
 * So: the OUTER element scales and re-stacks on hover; the INNER element does the
 * floating. One transform each, no fight.
 */
.tile {
  position: absolute;
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.tile__float {
  /* Each tile drifts on its own loop; the two custom properties are set inline, so
     no two are ever in phase. */
  animation: float var(--float-duration, 18s) var(--float-delay, 0s) infinite ease-in-out;
  padding: 16px;
  border-radius: 20px;
  background: rgb(var(--fui-theme-surface));
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.07);
  box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.09);
  transition:
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

/* Hover (or keyboard focus) lifts it clean out of the pile. */
.tile:hover,
.tile:focus-visible {
  z-index: 50;
  transform: scale(1.09);
}
.tile:hover .tile__float,
.tile:focus-visible .tile__float {
  box-shadow: 0 24px 50px -12px rgba(var(--fui-theme-primary), 0.32);
  border-color: rgba(var(--fui-theme-primary), 0.5);
  /* Freeze the drift while it is being looked at, so it can't wander out from
     under the cursor mid-hover. */
  animation-play-state: paused;
}
.tile:focus-visible {
  outline: 2px solid rgb(var(--fui-theme-primary));
  outline-offset: 3px;
  border-radius: 22px;
}

.tile__inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(4px);
  }
  70% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0);
  }
}

/* ---- per-tile sizing ---- */
.tile--card {
  width: 280px;
}
.mini-card {
  width: 100%;
  max-width: none;
  box-shadow: none;
  border: 0;
}
.tile--buttons {
  width: 265px;
}
.tile--switch {
  width: 210px;
}
.tile--input {
  width: 270px;
}
.tile--avatar {
  width: 210px;
}
.tile--rating {
  width: 170px;
}
.tile--chips {
  width: 250px;
}
.tile--alert {
  width: 250px;
}
.tile--progress {
  width: 150px;
  align-items: center;
}
.tile--slider {
  width: 200px;
}
.tile--badge {
  width: 84px;
  align-items: center;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/*
 * ---- responsive ----
 *
 * The stage scales as one piece and never changes its own width. The tiles are
 * absolutely positioned against a 620px coordinate space, so a narrower stage does
 * NOT reflow them — it just leaves them hanging outside it, to be clipped. Shrink
 * the whole stage with a transform instead, and keep the 620px box.
 */
@media (max-width: 1280px) {
  .stage {
    transform: scale(0.82);
    transform-origin: center left;
  }
}
@media (max-width: 1080px) {
  .stage {
    transform: scale(0.68);
  }
}
@media (max-width: 960px) {
  /* Under the fold-split it stops being a side panel and becomes a centred collage
     below the copy. A transform doesn't shrink the layout box, so the height it
     still reserves (620px) has to be clawed back by hand, or it leaves a hole. */
  .stage {
    transform: scale(0.56);
    transform-origin: top center;
    margin-bottom: -273px; /* 620 - (620 × 0.56) */
  }
}
@media (max-width: 420px) {
  .stage {
    transform: scale(0.46);
    margin-bottom: -335px; /* 620 - (620 × 0.46) */
  }
}

@media (prefers-reduced-motion: reduce) {
  .tile,
  .tile__float {
    animation: none;
    transition: none;
  }
  /* The lift is still communicated — by depth and the raised z-index, not by motion. */
  .tile:hover,
  .tile:focus-visible {
    transform: none;
  }
}
</style>
