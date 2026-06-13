import type { ComponentObjectPropsOptions, Prop } from 'vue'

/**
 * Creates a reusable, composable prop definition.
 *
 * The returned function can be called with an optional `defaults` object to
 * override the `default` value of any prop — this is what lets components and
 * blueprints layer their own defaults on top of a shared definition.
 *
 * ```ts
 * const makeVdBtnProps = propsFactory({
 *   flat: Boolean,
 *   ...makeVariantProps({ variant: 'elevated' }),
 * }, 'FBtn')
 *
 * props: makeVdBtnProps()                 // base
 * props: makeVdBtnProps({ flat: true })   // override a default
 * ```
 */
export function propsFactory<PropsOptions extends Readonly<ComponentObjectPropsOptions>>(
  props: PropsOptions,
  _source?: string
) {
  return function <Defaults extends Partial<Record<keyof PropsOptions, unknown>> = object>(
    defaults?: Defaults
  ): PropsOptions {
    const result = {} as Record<string, unknown>
    for (const key of Object.keys(props)) {
      const original = props[key]
      const isDefinition =
        typeof original === 'object' && original !== null && !Array.isArray(original)
      const definition: Record<string, unknown> = isDefinition
        ? { ...(original as object) }
        : { type: original as Prop<unknown> }

      if (defaults && key in defaults) {
        result[key] = { ...definition, default: (defaults as Record<string, unknown>)[key] }
      } else {
        result[key] = definition
      }
    }
    return result as PropsOptions
  }
}
