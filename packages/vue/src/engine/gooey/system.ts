/**
 * GooSystem — the thing components actually drive.
 *
 * Holds the blobs, steps the physics, and renders the field as marching-
 * squares contours. One `step(dt)` then read `toPath()` per frame. Pointer
 * and bounds are mutable so a component can wire them to events/resize.
 */

import { makeKernelCache, type FieldKernelCache } from './field'
import { fieldToContours, contoursToPath, type MarchConfig } from './marching'
import { stepBlobs, type StepContext } from './physics'
import { resolveGooParams } from './types'
import type { Blob, Contour, DeepPartial, GooParams, PointerForce } from './types'

export class GooSystem {
  blobs: Blob[]
  params: GooParams
  pointer: PointerForce = { x: 0, y: 0, strength: 0, radius: 120, active: false }
  private cache: FieldKernelCache

  constructor(blobs: Blob[] = [], params?: DeepPartial<GooParams>) {
    this.blobs = blobs
    this.params = resolveGooParams(params)
    this.cache = makeKernelCache(this.params.field.kernel, this.params.field.threshold)
  }

  setParams(params: DeepPartial<GooParams>): void {
    this.params = resolveGooParams({ ...this.params, ...params } as DeepPartial<GooParams>)
    this.cache = makeKernelCache(this.params.field.kernel, this.params.field.threshold)
  }

  setBounds(width: number, height: number): void {
    this.params.bounds.width = width
    this.params.bounds.height = height
  }

  add(blob: Blob): void {
    this.blobs.push(blob)
  }

  step(dt: number): void {
    const ctx: StepContext = {
      physics: this.params.physics,
      bounds: this.params.bounds,
      pointer: this.pointer.active ? this.pointer : undefined,
    }
    // clamp dt so a tab-switch stall can't explode the sim
    stepBlobs(this.blobs, ctx, Math.min(dt, 1 / 30))
  }

  contours(cell = 8): Contour[] {
    const cfg: MarchConfig = {
      width: this.params.bounds.width,
      height: this.params.bounds.height,
      cell,
    }
    return fieldToContours(this.blobs, this.cache, cfg)
  }

  /** Ready-to-render SVG path of the whole gooey field. */
  toPath(cell = 8, smoothing = 2): string {
    return contoursToPath(this.contours(cell), smoothing)
  }
}
