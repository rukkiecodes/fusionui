# Installation

## Scaffold a new project

The fastest way to start is the project scaffolder:

```bash
npm create fusionui@latest
# or: pnpm create fusionui / yarn create fusionui / bun create fusionui
```

## Add to an existing project

```bash
pnpm add @rukkiecodes/vue @rukkiecodes/icons
```

Register the plugin and import the styles:

```ts
// main.ts
import { createApp } from 'vue'
import { createFusionUI } from '@rukkiecodes/vue'
import { fusionSet, fusionAliases } from '@rukkiecodes/icons'
import '@rukkiecodes/vue/styles'
import App from './App.vue'

const fusionui = createFusionUI({
  theme: { defaultTheme: 'light' },
  icons: {
    defaultSet: 'fusion',
    sets: { fusion: fusionSet },
    aliases: fusionAliases,
  },
})

createApp(App).use(fusionui).mount('#app')
```

That's it — every `F*` component is registered globally:

<Example file="button/colors" />
