// WebGL2 runtime — the heavy module. Imported dynamically by FShaderSurface only
// when the surface is on-screen, WebGL2 is available and motion is allowed, so it
// never sits in the critical path.

import type { ShaderRunner, ShaderValues } from '../types'

// Fullscreen triangle — one draw call covers the viewport, no index buffer.
const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error(`[fusionui/shaders] shader compile failed: ${log}`)
  }
  return sh
}

function link(gl: WebGL2RenderingContext, frag: string): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag)
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog)
    gl.deleteProgram(prog)
    throw new Error(`[fusionui/shaders] program link failed: ${log}`)
  }
  return prog
}

export interface RunnerConfig {
  /** Frames per second cap (battery-friendly default). */
  fps?: number
  /** Device-pixel-ratio cap so big retina surfaces stay cheap. */
  maxDpr?: number
}

/**
 * Build a runner for one canvas + fragment shader. The component owns `values`
 * (a mutable object) and mutates it between frames; the runner reads it each
 * draw and binds the uniforms. The runner owns time, resolution and the rAF/FPS
 * loop, and pauses cleanly via stop()/start().
 */
export function createShaderRunner(
  canvas: HTMLCanvasElement,
  frag: string,
  values: ShaderValues,
  config: RunnerConfig = {}
): ShaderRunner {
  const fps = config.fps ?? 30
  const maxDpr = config.maxDpr ?? 2
  const frameMs = 1000 / fps

  const gl = canvas.getContext('webgl2', { premultipliedAlpha: false, antialias: false })
  if (!gl) throw new Error('[fusionui/shaders] WebGL2 unavailable')

  const prog = link(gl, frag)
  const quad = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'a_pos')
  const vao = gl.createVertexArray()!
  gl.bindVertexArray(vao)
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const u = {
    time: gl.getUniformLocation(prog, 'u_time'),
    res: gl.getUniformLocation(prog, 'u_resolution'),
    pointer: gl.getUniformLocation(prog, 'u_pointer'),
    colorA: gl.getUniformLocation(prog, 'u_colorA'),
    colorB: gl.getUniformLocation(prog, 'u_colorB'),
    intensity: gl.getUniformLocation(prog, 'u_intensity'),
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  let raf = 0
  let running = false
  let startTime = 0
  let lastDraw = 0

  function resize(): void {
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, maxDpr)
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl!.viewport(0, 0, canvas.width, canvas.height)
  }

  function draw(now: number): void {
    if (!running) return
    raf = requestAnimationFrame(draw)
    if (now - lastDraw < frameMs) return // FPS cap
    lastDraw = now
    if (!startTime) startTime = now

    resize()
    gl!.useProgram(prog)
    gl!.bindVertexArray(vao)
    gl!.uniform1f(u.time, (now - startTime) / 1000)
    gl!.uniform2f(u.res, canvas.width, canvas.height)
    gl!.uniform2f(u.pointer, values.pointer[0], values.pointer[1])
    gl!.uniform3f(u.colorA, values.colorA[0], values.colorA[1], values.colorA[2])
    gl!.uniform3f(u.colorB, values.colorB[0], values.colorB[1], values.colorB[2])
    gl!.uniform1f(u.intensity, values.intensity)
    gl!.clearColor(0, 0, 0, 0)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.drawArrays(gl!.TRIANGLES, 0, 3)
  }

  return {
    start() {
      if (running) return
      running = true
      lastDraw = 0
      raf = requestAnimationFrame(draw)
    },
    stop() {
      running = false
      cancelAnimationFrame(raf)
    },
    resize,
    destroy() {
      running = false
      cancelAnimationFrame(raf)
      gl!.deleteProgram(prog)
      gl!.deleteBuffer(quad)
      gl!.deleteVertexArray(vao)
      const lose = gl!.getExtension('WEBGL_lose_context')
      lose?.loseContext()
    },
  }
}
