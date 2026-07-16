// Per-component documentation that isn't part of the CLI's registry contract:
// the props table and a usage snippet. Keyed by the same slug as
// packages/native/registry/registry.json.

export interface ApiRow {
  prop: string
  type: string
  default?: string
}

export interface DocMeta {
  api: ApiRow[]
  usage: string
}

export const docsMeta: Record<string, DocMeta> = {
  text: {
    api: [
      { prop: 'level', type: "'h1' … 'h6'", default: '—' },
      { prop: 'size', type: 'number', default: '18' },
      { prop: 'weight', type: "'thin' … 'black'", default: "'bold'" },
      { prop: 'color', type: 'string | colour variant', default: "'#FFFFFF'" },
      { prop: 'align', type: "'left' | 'center' | 'right' | 'justify'", default: "'left'" },
      { prop: 'numberOfLines', type: 'number', default: '—' },
      { prop: 'loading', type: 'boolean (skeleton)', default: 'false' },
      { prop: 'prefix / suffix', type: 'ReactNode', default: '—' },
    ],
    usage: `import { Text } from './components/ui/text'

export function Example() {
  return (
    <>
      <Text.H1 color="primary">Welcome</Text.H1>
      <Text size={16} weight="medium" color="muted" numberOfLines={2}>
        A typography primitive with levels, weights and colour variants.
      </Text>
    </>
  )
}`,
  },
  button: {
    api: [
      { prop: 'onPress', type: '() => void', default: '—' },
      { prop: 'backgroundColor', type: 'string', default: "'#fff'" },
      { prop: 'gradientColors', type: 'string[]', default: '—' },
      { prop: 'isLoading', type: 'boolean', default: 'false' },
      { prop: 'loadingText', type: 'string', default: "'Loading...'" },
      { prop: 'width / height', type: 'number', default: '220 / 52' },
      { prop: 'borderRadius', type: 'number', default: 'height / 2' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
    ],
    usage: `import { Button } from './components/ui/button'
import { Text } from './components/ui/text'

export function Example() {
  return (
    <Button gradientColors={['#195bff', '#7d5fff']} onPress={save}>
      <Text color="#fff" weight="bold">
        Continue
      </Text>
    </Button>
  )
}`,
  },
}
