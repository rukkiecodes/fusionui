/**
 * useLiquidGlass — web adapter (Vue 3).
 *
 * Pipeline per element:
 *   ResizeObserver → rasterizeGlassField() → canvas → data URL
 *     → <feImage> + <feGaussianBlur> + <feDisplacementMap> + <feColorMatrix>
 *     → backdrop-filter: url(#fui-glass-N)
 *
 * Browser reality check (June 2026):
 *  - Chromium applies SVG filters in `backdrop-filter` → full refraction.
 *  - Safari / Firefox do not, so we fall back to blur+saturate (the classic
 *    frosted look) and still paint the rim highlight + bevel shading, which
 *    fakes the lensing convincingly. Detection is capability-based where
 *    possible and degrades safely.
 */

import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { CSSProperties, Ref } from 'vue'
import { rasterizeGlassField, resolveOptions } from '../engine/liquid-glass'
import type { GlassFieldMaps, GlassOptions } from '../engine/liquid-glass'

let uid = 0
let svgRoot: SVGSVGElement | null = null

/** One hidden <svg><defs> shared by every glass instance on the page. */
function ensureSvgRoot(): SVGSVGElement {
  if (svgRoot && document.contains(svgRoot)) return svgRoot
  const NS = 'http://www.w3.org/2000/svg'
  svgRoot = document.createElementNS(NS, 'svg')
  svgRoot.setAttribute('width', '0')
  svgRoot.setAttribute('height', '0')
  svgRoot.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
  svgRoot.appendChild(document.createElementNS(NS, 'defs'))
  document.body.appendChild(svgRoot)
  return svgRoot
}

/**
 * Chromium is currently the only engine that applies `url()` filters inside
 * `backdrop-filter`. Safari/Firefox report `CSS.supports()` true but don't
 * actually apply them, so we gate on being a Chromium *engine* as well.
 *
 * Detection prefers UA Client Hints (`userAgentData.brands` lists "Chromium"
 * on every Chromium browser — Chrome, Edge, Brave, even headless — and is
 * absent on WebKit/Gecko). It falls back to `window.chrome` for older
 * Chromium that predates Client Hints. We deliberately do NOT sniff the UA
 * string: "CriOS" (Chrome on iOS) is WebKit and must read as unsupported.
 */
export function supportsSvgBackdropFilter(): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') return false
  const uaData = (navigator as { userAgentData?: { brands?: { brand: string }[] } }).userAgentData
  const isChromium = uaData?.brands
    ? uaData.brands.some(b => /Chromium/i.test(b.brand))
    : 'chrome' in window
  return isChromium && CSS.supports('backdrop-filter', 'url(#x)')
}

function mapsToDataUrl(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  canvas: HTMLCanvasElement
): string {
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(new ImageData(data as Uint8ClampedArray<ArrayBuffer>, width, height), 0, 0)
  return canvas.toDataURL()
}

export interface UseLiquidGlassReturn {
  /** Bind to the glass element: `:style="glassStyle"`. */
  glassStyle: Ref<CSSProperties>
  /** Bind to an absolutely-positioned overlay child for the rim highlight. */
  highlightStyle: Ref<CSSProperties>
  /** True when real SVG refraction is active (Chromium). */
  refracting: Ref<boolean>
  /** Latest rasterized field (e.g. for debugging / tests). */
  field: Ref<GlassFieldMaps | null>
  /** Force a regeneration (rarely needed; resize is observed). */
  update: () => void
}

export function useLiquidGlass(
  target: Ref<HTMLElement | null>,
  options: Ref<Partial<GlassOptions>> | Partial<GlassOptions> = {}
): UseLiquidGlassReturn {
  const id = `fui-glass-${++uid}`
  const optionsRef = 'value' in options ? (options as Ref<Partial<GlassOptions>>) : ref(options)

  const refracting = ref(false)
  const field = shallowRef<GlassFieldMaps | null>(null)
  const highlightUrl = ref('')
  const filterReady = ref(false)

  const dispCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
  const glowCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null

  let filterEl: SVGFilterElement | null = null
  let observer: ResizeObserver | null = null
  let raf = 0

  function buildFilter(maps: GlassFieldMaps, opts: ReturnType<typeof resolveOptions>) {
    const NS = 'http://www.w3.org/2000/svg'
    const defs = ensureSvgRoot().querySelector('defs')!
    if (!filterEl) {
      filterEl = document.createElementNS(NS, 'filter')
      filterEl.setAttribute('id', id)
      filterEl.setAttribute('color-interpolation-filters', 'sRGB')
      filterEl.setAttribute('x', '0')
      filterEl.setAttribute('y', '0')
      filterEl.setAttribute('width', '100%')
      filterEl.setAttribute('height', '100%')
      defs.appendChild(filterEl)
    }
    filterEl.replaceChildren()

    const cssW = maps.width / maps.scale
    const cssH = maps.height / maps.scale

    const feImage = document.createElementNS(NS, 'feImage')
    feImage.setAttribute(
      'href',
      mapsToDataUrl(maps.displacement, maps.width, maps.height, dispCanvas!)
    )
    feImage.setAttribute('x', '0')
    feImage.setAttribute('y', '0')
    feImage.setAttribute('width', String(cssW))
    feImage.setAttribute('height', String(cssH))
    feImage.setAttribute('preserveAspectRatio', 'none')
    feImage.setAttribute('result', 'map')

    const feBlur = document.createElementNS(NS, 'feGaussianBlur')
    feBlur.setAttribute('in', 'SourceGraphic')
    feBlur.setAttribute('stdDeviation', String(opts.blur))
    feBlur.setAttribute('result', 'soft')

    const feDisp = document.createElementNS(NS, 'feDisplacementMap')
    feDisp.setAttribute('in', 'soft')
    feDisp.setAttribute('in2', 'map')
    feDisp.setAttribute('scale', String(maps.maxDisplacement * 2))
    feDisp.setAttribute('xChannelSelector', 'R')
    feDisp.setAttribute('yChannelSelector', 'G')
    feDisp.setAttribute('result', 'bent')

    const feSat = document.createElementNS(NS, 'feColorMatrix')
    feSat.setAttribute('in', 'bent')
    feSat.setAttribute('type', 'saturate')
    feSat.setAttribute('values', String(opts.saturation))

    filterEl.append(feImage, feBlur, feDisp, feSat)
    filterReady.value = true
  }

  function update() {
    const el = target.value
    if (!el || typeof window === 'undefined') return
    const rect = el.getBoundingClientRect()
    if (rect.width < 4 || rect.height < 4) return

    const opts = resolveOptions(optionsRef.value)
    const radius = parseFloat(getComputedStyle(el).borderRadius) || 0
    const maps = rasterizeGlassField({ width: rect.width, height: rect.height, radius }, opts, {
      scale: Math.min(window.devicePixelRatio || 1, 2),
    })
    field.value = maps
    highlightUrl.value = mapsToDataUrl(maps.highlight, maps.width, maps.height, glowCanvas!)

    if (supportsSvgBackdropFilter()) {
      buildFilter(maps, opts)
      refracting.value = true
    } else {
      refracting.value = false
    }
  }

  function scheduleUpdate() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(update)
  }

  onMounted(() => {
    observer = new ResizeObserver(scheduleUpdate)
    if (target.value) observer.observe(target.value)
    scheduleUpdate()
  })

  watch(target, (el, _old) => {
    observer?.disconnect()
    if (el && observer) observer.observe(el)
    scheduleUpdate()
  })
  watch(optionsRef, scheduleUpdate, { deep: true })

  onBeforeUnmount(() => {
    observer?.disconnect()
    cancelAnimationFrame(raf)
    filterEl?.remove()
  })

  const glassStyle = computed<CSSProperties>(() => {
    const opts = resolveOptions(optionsRef.value)
    const fallback = `blur(${Math.max(opts.blur, 6)}px) saturate(${opts.saturation})`
    return {
      position: 'relative',
      isolation: 'isolate',
      backgroundColor: opts.tint,
      backdropFilter: refracting.value && filterReady.value ? `url(#${id})` : fallback,
      WebkitBackdropFilter: fallback, // Safari ignores url(); keep frosted look
    }
  })

  const highlightStyle = computed<CSSProperties>(() => ({
    position: 'absolute',
    inset: '0',
    borderRadius: 'inherit',
    pointerEvents: 'none',
    backgroundImage: highlightUrl.value ? `url(${highlightUrl.value})` : undefined,
    backgroundSize: '100% 100%',
    mixBlendMode: 'screen',
  }))

  return { glassStyle, highlightStyle, refracting, field, update }
}
