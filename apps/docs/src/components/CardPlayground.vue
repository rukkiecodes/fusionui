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
  { value: '10', label: 'Flip' },
  { value: '11', label: 'Swipe deck' },
  { value: '12', label: 'X' },
  { value: '13', label: 'Facebook' },
  { value: '14', label: 'Instagram' },
]
const images = ['foto5.png', 'foto1.png', 'foto2.jpg', 'foto6.png', 'foto13.png']
const deckPeople = [
  { src: 'foto1.png', name: 'Alex, 27' },
  { src: 'foto6.png', name: 'Sam, 24' },
  { src: 'foto13.png', name: 'Jordan, 30' },
  { src: 'foto5.png', name: 'Riley, 26' },
]

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

const isFlip = computed(() => type.value === '10')
const isDeck = computed(() => type.value === '11')
const isSocial = computed(() => ['12', '13', '14'].includes(type.value))
const isImage = computed(() => !isFlip.value && !isDeck.value && !isSocial.value)
const imgUrl = computed(() => `${import.meta.env.BASE_URL}cards/${cfg.image}`)
const avatarUrl = computed(() => `${import.meta.env.BASE_URL}cards/foto1.png`)
const deckUrl = (n: string) => `${import.meta.env.BASE_URL}cards/${n}`
const meta = computed(() =>
  type.value === '12'
    ? '@handle · 2h'
    : type.value === '13'
      ? 'Yesterday at 14:32'
      : 'Santorini, Greece'
)

const code = computed(() => {
  if (isFlip.value) return flipCode()
  if (isDeck.value) return deckCode()
  if (isSocial.value) return socialCode()
  const lines: string[] = []
  const attrs: string[] = []
  if (type.value !== '1') attrs.push(`type="${type.value}"`)
  if (type.value === '6' && cfg.parallax !== 280) attrs.push(`:parallax="${cfg.parallax}"`)
  lines.push(`<f-card${attrs.length ? ' ' + attrs.join(' ') : ''}>`)
  if (cfg.title) lines.push(`  <template #title><h3>${cfg.title}</h3></template>`)
  lines.push(`  <template #img><img src="/cards/${cfg.image}" alt="" /></template>`)
  if (cfg.text) lines.push(`  <template #text><p>${cfg.text}</p></template>`)
  if (cfg.interactions) {
    lines.push(`  <template #interactions>`)
    lines.push(`    <f-btn icon="heart" color="danger" />`)
    lines.push(`    <f-btn color="primary" prepend-icon="message-circle">54</f-btn>`)
    lines.push(`  </template>`)
  }
  lines.push(`</f-card>`)
  return lines.join('\n')
})

function flipCode() {
  return [
    `<f-card type="10">`,
    `  <template #front>`,
    `    <img src="/cards/${cfg.image}" alt="" />`,
    `  </template>`,
    `  <template #back>`,
    `    <h3>${cfg.title}</h3>`,
    `    <p>${cfg.text}</p>`,
    `    <f-btn color="primary" size="small">Shop now</f-btn>`,
    `  </template>`,
    `</f-card>`,
  ].join('\n')
}

function deckCode() {
  return [
    `<f-card type="11" style="max-width: 280px">`,
    `  <div v-for="p in people" :key="p.name">`,
    `    <img :src="p.src" alt="" />`,
    `    <div class="deck-name">{{ p.name }}</div>`,
    `  </div>`,
    `</f-card>`,
  ].join('\n')
}

function socialCode() {
  const t = type.value
  const l: string[] = [`<f-card type="${t}">`]
  l.push(`  <template #avatar><img src="/cards/foto1.png" alt="" /></template>`)
  l.push(`  <template #header>`)
  l.push(`    <strong>${cfg.title}</strong>`)
  l.push(`    <span>${meta.value}</span>`)
  l.push(`  </template>`)
  if (t !== '14') l.push(`  <template #text><p>${cfg.text}</p></template>`)
  l.push(`  <template #img><img src="/cards/${cfg.image}" alt="" /></template>`)
  l.push(`  <template #actions>`)
  if (t === '12') {
    l.push(`    <button class="fui-act"><f-icon icon="message-circle" size="small" /> 12</button>`)
    l.push(`    <button class="fui-act"><f-icon icon="repeat" size="small" /> 48</button>`)
    l.push(`    <button class="fui-act"><f-icon icon="heart" size="small" /> 312</button>`)
    l.push(`    <button class="fui-act"><f-icon icon="bar-chart-2" size="small" /> 9.8k</button>`)
  } else if (t === '13') {
    l.push(`    <button class="fui-act"><f-icon icon="thumbs-up" size="small" /> Like</button>`)
    l.push(
      `    <button class="fui-act"><f-icon icon="message-circle" size="small" /> Comment</button>`
    )
    l.push(`    <button class="fui-act"><f-icon icon="share-2" size="small" /> Share</button>`)
  } else {
    l.push(`    <button class="fui-act"><f-icon icon="heart" /></button>`)
    l.push(`    <button class="fui-act"><f-icon icon="message-circle" /></button>`)
    l.push(`    <button class="fui-act"><f-icon icon="send" /></button>`)
    l.push(`    <f-spacer />`)
    l.push(`    <button class="fui-act"><f-icon icon="bookmark" /></button>`)
  }
  l.push(`  </template>`)
  if (t === '14') {
    l.push(`  <template #text>`)
    l.push(`    <p><strong>2,418 likes</strong></p>`)
    l.push(`    <p><strong>${cfg.title}</strong> ${cfg.text}</p>`)
    l.push(`  </template>`)
  }
  l.push(`</f-card>`)
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
          <f-icon icon="refresh-cw" size="small" />
        </button>
        <button class="pg__icon" title="Copy code" @click="copy">
          <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        </button>
      </div>
    </div>

    <div class="pg__body">
      <div class="pg__preview">
        <!-- Flip (10) -->
        <f-card v-if="isFlip" type="10">
          <template #front><img :src="imgUrl" alt="" /></template>
          <template #back>
            <h3>{{ cfg.title }}</h3>
            <p>{{ cfg.text }}</p>
            <f-btn color="primary" size="small">Shop now</f-btn>
          </template>
        </f-card>

        <!-- Swipe deck (11) -->
        <f-card v-else-if="isDeck" type="11" style="max-width: 280px">
          <div v-for="p in deckPeople" :key="p.name">
            <img :src="deckUrl(p.src)" alt="" />
            <div class="pg-deck-name">{{ p.name }}</div>
          </div>
        </f-card>

        <!-- Social feed cards (12–14) -->
        <f-card v-else-if="isSocial" :type="type">
          <template #avatar><img :src="avatarUrl" alt="" /></template>
          <template #header>
            <strong>{{ cfg.title }}</strong>
            <span>{{ meta }}</span>
          </template>
          <template v-if="type !== '14'" #text>
            <p>{{ cfg.text }}</p>
          </template>
          <template #img><img :src="imgUrl" alt="" /></template>
          <template #actions>
            <template v-if="type === '12'">
              <button class="fui-act"><f-icon icon="message-circle" size="small" /> 12</button>
              <button class="fui-act"><f-icon icon="repeat" size="small" /> 48</button>
              <button class="fui-act"><f-icon icon="heart" size="small" /> 312</button>
              <button class="fui-act"><f-icon icon="bar-chart-2" size="small" /> 9.8k</button>
            </template>
            <template v-else-if="type === '13'">
              <button class="fui-act"><f-icon icon="thumbs-up" size="small" /> Like</button>
              <button class="fui-act"><f-icon icon="message-circle" size="small" /> Comment</button>
              <button class="fui-act"><f-icon icon="share-2" size="small" /> Share</button>
            </template>
            <template v-else>
              <button class="fui-act"><f-icon icon="heart" /></button>
              <button class="fui-act"><f-icon icon="message-circle" /></button>
              <button class="fui-act"><f-icon icon="send" /></button>
              <f-spacer />
              <button class="fui-act"><f-icon icon="bookmark" /></button>
            </template>
          </template>
          <template v-if="type === '14'" #text>
            <p><strong>2,418 likes</strong></p>
            <p>
              <strong>{{ cfg.title }}</strong> {{ cfg.text }}
            </p>
          </template>
        </f-card>

        <!-- Image-based cards (1–9) -->
        <f-card v-else :type="type" :parallax="cfg.parallax" style="max-width: 320px">
          <template v-if="cfg.title" #title
            ><h3>{{ cfg.title }}</h3></template
          >
          <template #img><img :src="imgUrl" alt="" /></template>
          <template v-if="cfg.text" #text
            ><p>{{ cfg.text }}</p></template
          >
          <template v-if="cfg.interactions" #interactions>
            <f-btn icon="heart" color="danger" />
            <f-btn color="primary" prepend-icon="message-circle">54</f-btn>
          </template>
        </f-card>
      </div>

      <div class="pg__config">
        <p class="pg__config-title">Configuration</p>
        <f-input v-model="cfg.title" :label="isSocial ? 'Name' : 'Title'" label-placeholder />
        <f-input v-model="cfg.text" :label="isSocial ? 'Content' : 'Text'" label-placeholder />
        <f-select v-if="!isDeck" v-model="cfg.image" :items="images" label="Image" />
        <div v-if="isImage" class="pg__checks">
          <f-checkbox v-model="cfg.interactions" label="Interactions" />
        </div>
        <div v-if="type === '6'" class="pg__slider">
          <p class="pg__config-title">Parallax intensity — {{ cfg.parallax }}px</p>
          <f-slider v-model="cfg.parallax" :min="20" :max="600" :step="10" color="primary" />
        </div>
        <p v-if="isDeck" class="pg__hint">Drag the top card left or right to swipe.</p>
      </div>
    </div>

    <Markup :code="code" lang="markup" />
  </div>
</template>

<style scoped>
.pg-deck-name {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 30px 18px 16px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
}
.pg__hint {
  margin: 4px 0 0;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
