<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const types = [
  { value: '1', label: 'Default' },
  { value: '2', label: 'Type 2' },
  { value: '3', label: 'Type 3' },
  { value: '4', label: 'Type 4' },
  { value: '5', label: 'Type 5' },
  { value: '6', label: 'Type 6' },
  { value: '8', label: 'Type 8' },
  { value: '9', label: 'Type 9' },
  { value: '10', label: 'X' },
  { value: '11', label: 'Facebook' },
  { value: '12', label: 'Instagram' },
]
const images = ['foto5.png', 'foto1.png', 'foto2.jpg', 'foto6.png', 'foto13.png']

const type = ref('1')
const copied = ref(false)

const cfg = reactive({
  title: 'Trendy clothing',
  text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  image: 'foto5.png',
  interactions: true,
  parallax: 280,
})

const defaults = JSON.stringify(cfg)

const isSocial = computed(() => ['10', '11', '12'].includes(type.value))
const imgUrl = computed(() => `${import.meta.env.BASE_URL}cards/${cfg.image}`)
const avatarUrl = computed(() => `${import.meta.env.BASE_URL}cards/foto1.png`)
const meta = computed(() =>
  type.value === '10'
    ? '@handle · 2h'
    : type.value === '11'
      ? 'Yesterday at 14:32'
      : 'Santorini, Greece'
)

const code = computed(() => {
  if (isSocial.value) return socialCode()
  const lines: string[] = []
  const attrs: string[] = []
  if (type.value !== '1') attrs.push(`type="${type.value}"`)
  if (type.value === '6' && cfg.parallax !== 280) attrs.push(`:parallax="${cfg.parallax}"`)
  lines.push(`<vd-card${attrs.length ? ' ' + attrs.join(' ') : ''}>`)
  if (cfg.title) lines.push(`  <template #title><h3>${cfg.title}</h3></template>`)
  lines.push(`  <template #img><img src="/cards/${cfg.image}" alt="" /></template>`)
  if (cfg.text) lines.push(`  <template #text><p>${cfg.text}</p></template>`)
  if (cfg.interactions) {
    lines.push(`  <template #interactions>`)
    lines.push(`    <vd-btn icon="heart" color="danger" />`)
    lines.push(`    <vd-btn color="primary" prepend-icon="message-circle">54</vd-btn>`)
    lines.push(`  </template>`)
  }
  lines.push(`</vd-card>`)
  return lines.join('\n')
})

function socialCode() {
  const t = type.value
  const l: string[] = [`<vd-card type="${t}">`]
  l.push(`  <template #avatar><img src="/cards/foto1.png" alt="" /></template>`)
  l.push(`  <template #header>`)
  l.push(`    <strong>${cfg.title}</strong>`)
  l.push(`    <span>${meta.value}</span>`)
  l.push(`  </template>`)
  if (t !== '12') l.push(`  <template #text><p>${cfg.text}</p></template>`)
  l.push(`  <template #img><img src="/cards/${cfg.image}" alt="" /></template>`)
  l.push(`  <template #actions>`)
  if (t === '10') {
    l.push(`    <button class="vd-act"><vd-icon icon="message-circle" size="small" /> 12</button>`)
    l.push(`    <button class="vd-act"><vd-icon icon="repeat" size="small" /> 48</button>`)
    l.push(`    <button class="vd-act"><vd-icon icon="heart" size="small" /> 312</button>`)
    l.push(`    <button class="vd-act"><vd-icon icon="bar-chart-2" size="small" /> 9.8k</button>`)
  } else if (t === '11') {
    l.push(`    <button class="vd-act"><vd-icon icon="thumbs-up" size="small" /> Like</button>`)
    l.push(
      `    <button class="vd-act"><vd-icon icon="message-circle" size="small" /> Comment</button>`
    )
    l.push(`    <button class="vd-act"><vd-icon icon="share-2" size="small" /> Share</button>`)
  } else {
    l.push(`    <button class="vd-act"><vd-icon icon="heart" /></button>`)
    l.push(`    <button class="vd-act"><vd-icon icon="message-circle" /></button>`)
    l.push(`    <button class="vd-act"><vd-icon icon="send" /></button>`)
    l.push(`    <vd-spacer />`)
    l.push(`    <button class="vd-act"><vd-icon icon="bookmark" /></button>`)
  }
  l.push(`  </template>`)
  if (t === '12') {
    l.push(`  <template #text>`)
    l.push(`    <p><strong>2,418 likes</strong></p>`)
    l.push(`    <p><strong>${cfg.title}</strong> ${cfg.text}</p>`)
    l.push(`  </template>`)
  }
  l.push(`</vd-card>`)
  return l.join('\n')
}

async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
function reset() {
  type.value = '1'
  Object.assign(cfg, JSON.parse(defaults))
}
</script>

<template>
  <div class="pg">
    <div class="pg__bar">
      <div class="pg__tabs">
        <button
          v-for="t in types"
          :key="t.value"
          class="pg__tab"
          :class="{ 'pg__tab--active': type === t.value }"
          @click="type = t.value"
        >
          {{ t.label }}
        </button>
      </div>
      <div class="pg__bar-actions">
        <button class="pg__icon" title="Reset" @click="reset">
          <vd-icon icon="refresh-cw" size="small" />
        </button>
        <button class="pg__icon" title="Copy code" @click="copy">
          <vd-icon :icon="copied ? 'check' : 'copy'" size="small" />
        </button>
      </div>
    </div>

    <div class="pg__body">
      <div class="pg__preview">
        <!-- Social feed cards (10–12) -->
        <vd-card v-if="isSocial" :type="type">
          <template #avatar><img :src="avatarUrl" alt="" /></template>
          <template #header>
            <strong>{{ cfg.title }}</strong>
            <span>{{ meta }}</span>
          </template>
          <template v-if="type !== '12'" #text>
            <p>{{ cfg.text }}</p>
          </template>
          <template #img><img :src="imgUrl" alt="" /></template>
          <template #actions>
            <template v-if="type === '10'">
              <button class="vd-act"><vd-icon icon="message-circle" size="small" /> 12</button>
              <button class="vd-act"><vd-icon icon="repeat" size="small" /> 48</button>
              <button class="vd-act"><vd-icon icon="heart" size="small" /> 312</button>
              <button class="vd-act"><vd-icon icon="bar-chart-2" size="small" /> 9.8k</button>
            </template>
            <template v-else-if="type === '11'">
              <button class="vd-act"><vd-icon icon="thumbs-up" size="small" /> Like</button>
              <button class="vd-act"><vd-icon icon="message-circle" size="small" /> Comment</button>
              <button class="vd-act"><vd-icon icon="share-2" size="small" /> Share</button>
            </template>
            <template v-else>
              <button class="vd-act"><vd-icon icon="heart" /></button>
              <button class="vd-act"><vd-icon icon="message-circle" /></button>
              <button class="vd-act"><vd-icon icon="send" /></button>
              <vd-spacer />
              <button class="vd-act"><vd-icon icon="bookmark" /></button>
            </template>
          </template>
          <template v-if="type === '12'" #text>
            <p><strong>2,418 likes</strong></p>
            <p>
              <strong>{{ cfg.title }}</strong> {{ cfg.text }}
            </p>
          </template>
        </vd-card>

        <!-- Image-based cards (1–9) -->
        <vd-card v-else :type="type" :parallax="cfg.parallax" style="max-width: 320px">
          <template v-if="cfg.title" #title
            ><h3>{{ cfg.title }}</h3></template
          >
          <template #img><img :src="imgUrl" alt="" /></template>
          <template v-if="cfg.text" #text
            ><p>{{ cfg.text }}</p></template
          >
          <template v-if="cfg.interactions" #interactions>
            <vd-btn icon="heart" color="danger" />
            <vd-btn color="primary" prepend-icon="message-circle">54</vd-btn>
          </template>
        </vd-card>
      </div>

      <div class="pg__config">
        <p class="pg__config-title">Configuration</p>
        <vd-input v-model="cfg.title" :label="isSocial ? 'Name' : 'Title'" label-placeholder />
        <vd-input v-model="cfg.text" :label="isSocial ? 'Content' : 'Text'" label-placeholder />
        <vd-select v-model="cfg.image" :items="images" label="Image" />
        <div v-if="!isSocial" class="pg__checks">
          <vd-checkbox v-model="cfg.interactions" label="Interactions" />
        </div>
        <div v-if="type === '6'" class="pg__slider">
          <p class="pg__config-title">Parallax intensity — {{ cfg.parallax }}px</p>
          <vd-slider v-model="cfg.parallax" :min="20" :max="600" :step="10" color="primary" />
        </div>
      </div>
    </div>

    <Markup :code="code" lang="markup" />
  </div>
</template>
