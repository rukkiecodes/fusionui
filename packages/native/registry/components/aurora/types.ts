interface AuroraProps {
  /** Canvas width. Defaults to the screen width. */
  width?: number
  /** Aurora band height. Defaults to 25% of the screen height. */
  height?: number
  /** Up to three aurora band colours (hex). */
  auroraColors?: string[]
  /** Sky gradient — [top, bottom] hex. */
  skyColors?: [string, string]
  /** Animation speed multiplier. */
  speed?: number
  /** Aurora brightness multiplier. */
  intensity?: number
  /** Drift direction of the bands, [x, y]. */
  waveDirection?: [number, number]
}

export type { AuroraProps }
