import type { ShaderEffect } from '../types'
import { gradient } from './gradient'
import { grain } from './grain'
import { glow } from './glow'
import { displace } from './displace'

export { gradient, grain, glow, displace }

/** The first-class effect catalogue, keyed by name. */
export const effects: Record<string, ShaderEffect> = {
  gradient,
  grain,
  glow,
  displace,
}

export type EffectName = keyof typeof effects | (string & {})

/** Resolve an effect by name or pass a custom one through. */
export function resolveEffect(effect: EffectName | ShaderEffect): ShaderEffect {
  if (typeof effect === 'string') {
    const found = effects[effect]
    if (!found) throw new Error(`[fusionui/shaders] unknown effect: ${effect}`)
    return found
  }
  return effect
}
