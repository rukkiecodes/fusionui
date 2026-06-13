/** Shared chart types. */
export interface Margins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface PlotRect {
  width: number
  height: number
  innerWidth: number
  innerHeight: number
  margin: Margins
}

/** A single tick ready to render: its value, pixel position, and label. */
export interface Tick {
  value: number
  position: number
  label: string
}
