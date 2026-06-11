# Installation

## Scaffold a new project

The fastest way to start is the project scaffolder:

```bash
npm create vue-dl@latest
# or: pnpm create vue-dl / yarn create vue-dl / bun create vue-dl
```

## Add to an existing project

```bash
pnpm add vue-dl @vue-dl/icons-feather
```

Register the plugin and import the styles:

```ts
// main.ts
import { createApp } from 'vue'
import { createVueDL } from 'vue-dl'
import { featherSet, featherAliases } from '@vue-dl/icons-feather'
import 'vue-dl/styles'
import App from './App.vue'

const vuedl = createVueDL({
  theme: { defaultTheme: 'light' },
  icons: {
    defaultSet: 'feather',
    sets: { feather: featherSet },
    aliases: featherAliases,
  },
})

createApp(App).use(vuedl).mount('#app')
```

That's it — every `Vd*` component is registered globally:

<Example file="button/colors-loading" />
