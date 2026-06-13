import { describe, it, expect } from 'vitest'
import { smin, shellCornerCommands, shellCornerSvg, shellContentCommands } from '../engine/shell'

describe('shell engine — smin (the goo blend operator)', () => {
  it('is the plain minimum when k = 0', () => {
    expect(smin(3, 7, 0)).toBe(3)
    expect(smin(-2, 5, 0)).toBe(-2)
  })
  it('pulls below the minimum where the two fields are close (the blend)', () => {
    // Equal inputs get the deepest blend: min − k/4.
    expect(smin(0, 0, 8)).toBeCloseTo(-2, 9)
    // Far-apart inputs are barely blended (≈ the minimum).
    expect(smin(0, 100, 8)).toBeCloseTo(0, 9)
  })
})

describe('shell engine — junction corner', () => {
  it('emits a closed move/line/curve path for the corner fillet', () => {
    const cmds = shellCornerCommands(20)
    expect(cmds.map(c => c.type)).toEqual(['M', 'L', 'C', 'Z'])
    expect(cmds[0]).toMatchObject({ type: 'M', x: 0, y: 0 })
    expect(cmds[1]).toMatchObject({ type: 'L', x: 20, y: 0 })
    // The cubic ends on the left edge at (0, size).
    expect(cmds[2]).toMatchObject({ type: 'C', x: 0, y: 20 })
  })
  it('serialises to an SVG path string usable as a clip-path', () => {
    const d = shellCornerSvg(20)
    expect(d.startsWith('M')).toBe(true)
    expect(d).toContain('C')
    expect(d.trim().endsWith('Z')).toBe(true)
  })
})

describe('shell engine — content panel outline', () => {
  it('traces the content rectangle with a convex nestled top-left corner', () => {
    const cmds = shellContentCommands({
      width: 1000,
      height: 800,
      sidebarWidth: 264,
      navbarHeight: 60,
      radius: 20,
    })
    // Starts on the top edge just past the rounded corner…
    expect(cmds[0]).toMatchObject({ type: 'M', x: 284, y: 60 })
    // …runs the rectangle to the viewport's bottom-right…
    expect(cmds.some(c => c.type === 'L' && c.x === 1000 && c.y === 800)).toBe(true)
    // …and closes with the convex corner curve back to the top edge.
    const curve = cmds.find(c => c.type === 'C')!
    expect(curve).toMatchObject({ type: 'C', x: 284, y: 60 })
    expect(cmds[cmds.length - 1]).toMatchObject({ type: 'Z' })
  })
  it('clamps the radius to the available space', () => {
    const cmds = shellContentCommands({
      width: 300,
      height: 300,
      sidebarWidth: 280,
      navbarHeight: 60,
      radius: 100,
    })
    // (width − sidebarWidth)/2 = 10, so the radius is clamped to 10.
    expect(cmds[0]).toMatchObject({ type: 'M', x: 290, y: 60 })
  })
})
