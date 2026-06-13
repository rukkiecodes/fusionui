import { describe, it, expect } from 'vitest'
import {
  smin,
  shellCornerCommands,
  shellContentCommands,
  buildSkiaPath,
  type PathCommand,
} from '../engine/shell'

describe('native shell engine — parity with the web math', () => {
  it('smin is the metaball merge (min when k=0, deepest blend on equal inputs)', () => {
    expect(smin(3, 7, 0)).toBe(3)
    expect(smin(0, 0, 8)).toBeCloseTo(-2, 9)
    expect(smin(0, 100, 8)).toBeCloseTo(0, 9)
  })

  it('shellCornerCommands matches the web engine output exactly', () => {
    // Same numbers the web engine emits (0.4477 quarter-arc constant).
    expect(shellCornerCommands(20)).toEqual<PathCommand[]>([
      { type: 'M', x: 0, y: 0 },
      { type: 'L', x: 20, y: 0 },
      { type: 'C', x1: 8.954, y1: 0, x2: 0, y2: 8.954, x: 0, y: 20 },
      { type: 'Z' },
    ])
  })

  it('shellContentCommands traces the nestled content panel + clamps the radius', () => {
    const cmds = shellContentCommands({
      width: 1000,
      height: 800,
      sidebarWidth: 264,
      navbarHeight: 56,
      radius: 20,
    })
    expect(cmds[0]).toMatchObject({ type: 'M', x: 284, y: 56 })
    expect(cmds.some(c => c.type === 'L' && c.x === 1000 && c.y === 800)).toBe(true)
    expect(cmds.at(-1)).toMatchObject({ type: 'Z' })

    const clamped = shellContentCommands({
      width: 300,
      height: 300,
      sidebarWidth: 280,
      navbarHeight: 56,
      radius: 100,
    })
    expect(clamped[0]).toMatchObject({ type: 'M', x: 290, y: 56 }) // radius clamped to 10
  })
})

describe('buildSkiaPath — replays commands into an SkPath', () => {
  function mockSkia() {
    const calls: unknown[][] = []
    const path = {
      moveTo: (x: number, y: number) => calls.push(['moveTo', x, y]),
      lineTo: (x: number, y: number) => calls.push(['lineTo', x, y]),
      cubicTo: (...a: number[]) => calls.push(['cubicTo', ...a]),
      quadTo: (...a: number[]) => calls.push(['quadTo', ...a]),
      addArc: (...a: unknown[]) => calls.push(['addArc', ...a]),
      close: () => calls.push(['close']),
    }
    return { Skia: { Path: { Make: () => path } }, calls }
  }

  it('maps M/L/C/Z to moveTo/lineTo/cubicTo/close in order', () => {
    const { Skia, calls } = mockSkia()
    buildSkiaPath(Skia, shellCornerCommands(20))
    expect(calls).toEqual([
      ['moveTo', 0, 0],
      ['lineTo', 20, 0],
      ['cubicTo', 8.954, 0, 0, 8.954, 0, 20],
      ['close'],
    ])
  })

  it('maps ARC to addArc on the bounding oval (degrees)', () => {
    const { Skia, calls } = mockSkia()
    buildSkiaPath(Skia, [{ type: 'ARC', cx: 50, cy: 50, r: 10, a0: 0, a1: Math.PI / 2 }])
    expect(calls[0]).toEqual(['addArc', { x: 40, y: 40, width: 20, height: 20 }, 0, 90])
  })
})
