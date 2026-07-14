<script setup lang="ts">
// Original FusionUI artwork.
//
// Deliberately NOT the Vuesax illustrations: that project's repo declares GPL-3.0
// in LICENSE and ISC in its manifests, and FusionUI is MIT — copying 200 kB of
// someone else's marketing art into an MIT site with an unresolved copyleft
// question is not worth it, and it would make this page look like a clone rather
// than a product.
//
// So these are drawn from FusionUI's own language: the glass-panel mark, the
// primary→secondary gradient, and the tokens the library actually ships. They are
// theme-aware (they read --fui-theme-* rather than hard-coding), a few kB each,
// and every moving part stops under prefers-reduced-motion.

defineProps<{ name: 'tokens' | 'glass' | 'a11y' | 'platforms' }>()
</script>

<template>
  <svg
    v-if="name === 'tokens'"
    class="art"
    viewBox="0 0 480 380"
    role="img"
    aria-label="One source of design tokens generating CSS, TypeScript and React Native outputs"
  >
    <defs>
      <linearGradient id="a-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgb(var(--fui-theme-primary))" />
        <stop offset="1" stop-color="rgb(var(--fui-theme-secondary))" />
      </linearGradient>
    </defs>

    <!-- the single source -->
    <g class="drift">
      <rect x="176" y="34" width="128" height="86" rx="20" fill="url(#a-grad)" />
      <rect x="196" y="58" width="60" height="8" rx="4" fill="#fff" opacity=".85" />
      <rect x="196" y="76" width="88" height="8" rx="4" fill="#fff" opacity=".55" />
      <rect x="196" y="94" width="44" height="8" rx="4" fill="#fff" opacity=".35" />
    </g>

    <!-- the flow to each platform -->
    <path class="wire" d="M240 120 V 168 H 80 V 214" />
    <path class="wire wire--2" d="M240 120 V 214" />
    <path class="wire wire--3" d="M240 120 V 168 H 400 V 214" />

    <!-- the three generated outputs -->
    <g
      v-for="(o, i) in [
        { x: 20, t: 'CSS' },
        { x: 180, t: 'TS' },
        { x: 340, t: 'Native' },
      ]"
      :key="o.t"
    >
      <rect
        :x="o.x"
        y="214"
        width="120"
        height="106"
        rx="18"
        class="panel"
        :style="{ animationDelay: `${i * 0.4}s` }"
      />
      <rect :x="o.x + 20" y="240" width="52" height="7" rx="3.5" class="line" />
      <rect :x="o.x + 20" y="256" width="80" height="7" rx="3.5" class="line line--dim" />
      <rect :x="o.x + 20" y="272" width="64" height="7" rx="3.5" class="line line--dim" />
      <text :x="o.x + 20" y="306" class="cap">{{ o.t }}</text>
    </g>
  </svg>

  <svg
    v-else-if="name === 'glass'"
    class="art"
    viewBox="0 0 480 380"
    role="img"
    aria-label="Translucent glass panels refracting light over a gradient"
  >
    <defs>
      <linearGradient id="b-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgb(var(--fui-theme-primary))" />
        <stop offset="1" stop-color="rgb(var(--fui-theme-secondary))" />
      </linearGradient>
      <linearGradient id="b-sheen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".5" />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <clipPath id="b-lens">
        <rect x="150" y="130" width="180" height="180" rx="40" />
      </clipPath>
    </defs>

    <!-- the backdrop the glass refracts -->
    <rect x="40" y="40" width="400" height="300" rx="34" fill="url(#b-grad)" />
    <circle cx="140" cy="120" r="52" fill="#fff" opacity=".18" />
    <circle cx="360" cy="270" r="72" fill="#000" opacity=".1" />

    <!-- two panels, fusing; the overlap is brighter, because light passes through both -->
    <g class="drift">
      <rect x="90" y="130" width="180" height="180" rx="40" fill="#fff" fill-opacity=".38" />
      <rect x="150" y="70" width="180" height="180" rx="40" fill="#fff" fill-opacity=".38" />
      <g clip-path="url(#b-lens)">
        <rect x="150" y="70" width="180" height="180" rx="40" fill="#fff" fill-opacity=".55" />
      </g>
      <rect x="150" y="70" width="180" height="80" rx="40" fill="url(#b-sheen)" />
    </g>
  </svg>

  <svg
    v-else-if="name === 'a11y'"
    class="art"
    viewBox="0 0 480 380"
    role="img"
    aria-label="A component with a visible keyboard focus ring, and the keys that reach it"
  >
    <defs>
      <linearGradient id="c-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgb(var(--fui-theme-primary))" />
        <stop offset="1" stop-color="rgb(var(--fui-theme-secondary))" />
      </linearGradient>
    </defs>

    <!-- a dialog, focus-trapped -->
    <rect x="90" y="52" width="300" height="200" rx="22" class="panel" />
    <rect x="118" y="84" width="120" height="10" rx="5" class="line" />
    <rect x="118" y="108" width="200" height="8" rx="4" class="line line--dim" />
    <rect x="118" y="126" width="164" height="8" rx="4" class="line line--dim" />

    <!-- the focused control, with a real focus ring -->
    <rect x="238" y="182" width="118" height="42" rx="14" fill="url(#c-grad)" />
    <rect x="232" y="176" width="130" height="54" rx="18" class="ring" />
    <rect x="118" y="182" width="100" height="42" rx="14" class="ghost" />

    <!-- the keys that get you there -->
    <g class="keys">
      <g v-for="(k, i) in ['Tab', '↑', '↓', 'Esc']" :key="k">
        <rect
          :x="76 + i * 84"
          y="296"
          width="68"
          height="44"
          rx="12"
          class="key"
          :style="{ animationDelay: `${i * 0.5}s` }"
        />
        <text :x="76 + i * 84 + 34" y="324" class="key-cap">{{ k }}</text>
      </g>
    </g>
  </svg>

  <svg
    v-else
    class="art"
    viewBox="0 0 480 380"
    role="img"
    aria-label="The same design language on the web and on mobile, sharing one set of tokens"
  >
    <defs>
      <linearGradient id="d-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgb(var(--fui-theme-primary))" />
        <stop offset="1" stop-color="rgb(var(--fui-theme-secondary))" />
      </linearGradient>
    </defs>

    <!-- web -->
    <rect x="22" y="70" width="264" height="188" rx="18" class="panel" />
    <rect x="22" y="70" width="264" height="30" rx="18" fill="url(#d-grad)" opacity=".18" />
    <circle cx="44" cy="85" r="4" class="dot" />
    <circle cx="58" cy="85" r="4" class="dot" />
    <circle cx="72" cy="85" r="4" class="dot" />
    <rect x="44" y="122" width="88" height="8" rx="4" class="line" />
    <rect x="44" y="140" width="140" height="8" rx="4" class="line line--dim" />
    <rect x="44" y="182" width="92" height="34" rx="12" fill="url(#d-grad)" />

    <!-- mobile -->
    <g class="drift">
      <rect x="330" y="42" width="128" height="242" rx="24" class="panel" />
      <rect x="330" y="42" width="128" height="242" rx="24" fill="url(#d-grad)" opacity=".08" />
      <rect x="372" y="56" width="44" height="6" rx="3" class="line line--dim" />
      <rect x="350" y="96" width="60" height="8" rx="4" class="line" />
      <rect x="350" y="114" width="88" height="8" rx="4" class="line line--dim" />
      <rect x="350" y="150" width="88" height="30" rx="10" fill="url(#d-grad)" />
      <rect x="350" y="196" width="88" height="8" rx="4" class="line line--dim" />
    </g>

    <!-- one source of truth, feeding both -->
    <path class="wire" d="M286 164 H 330" />
    <text x="238" y="330" class="cap">one set of tokens</text>
    <path class="wire wire--2" d="M154 258 V 300 H 394 V 284" />
  </svg>
</template>

<style scoped>
.art {
  width: 100%;
  height: auto;
  max-width: 480px;
  overflow: visible;
}

/* Surfaces read the theme, so the art follows light/dark like everything else. */
.panel {
  fill: rgb(var(--fui-theme-surface));
  stroke: rgba(var(--fui-theme-on-surface), 0.1);
  stroke-width: 1.5;
  animation: rise 6s infinite ease-in-out;
}
.line {
  fill: rgba(var(--fui-theme-on-surface), 0.55);
}
.line--dim {
  fill: rgba(var(--fui-theme-on-surface), 0.2);
}
.dot {
  fill: rgba(var(--fui-theme-on-surface), 0.22);
}
.ghost {
  fill: rgba(var(--fui-theme-on-surface), 0.08);
}
.cap {
  fill: rgba(var(--fui-theme-on-surface), 0.5);
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
}

.wire {
  fill: none;
  stroke: rgba(var(--fui-theme-primary), 0.45);
  stroke-width: 2;
  stroke-dasharray: 6 7;
  animation: flow 1.6s linear infinite;
}
.wire--2 {
  animation-delay: 0.3s;
}
.wire--3 {
  animation-delay: 0.6s;
}

/* The focus ring is the point of the a11y panel, so it pulses. */
.ring {
  fill: none;
  stroke: rgb(var(--fui-theme-primary));
  stroke-width: 3;
  animation: pulse 2.4s infinite ease-in-out;
}
.key {
  fill: rgb(var(--fui-theme-surface));
  stroke: rgba(var(--fui-theme-on-surface), 0.14);
  stroke-width: 1.5;
  animation: press 3.2s infinite ease-in-out;
}
.key-cap {
  fill: rgba(var(--fui-theme-on-surface), 0.6);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  font-family: inherit;
}

.drift {
  animation: rise 7s infinite ease-in-out;
}

@keyframes rise {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-9px);
  }
}
@keyframes flow {
  to {
    stroke-dashoffset: -26;
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
@keyframes press {
  0%,
  88%,
  100% {
    transform: translateY(0);
  }
  92% {
    transform: translateY(3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .art *,
  .art {
    animation: none !important;
  }
}
</style>
