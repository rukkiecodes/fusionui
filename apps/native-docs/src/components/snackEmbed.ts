// Page-singleton loader for Expo Snack's embed.js. It scans the DOM for
// [data-snack-id] elements and swaps each for a snack.expo.dev player iframe. We
// want exactly ONE scan after all shells mount, so calls in the same frame collapse
// to a single appended script (which re-runs the scan, covering SPA navigation).
let scheduled = false

export function scheduleSnackEmbed(): void {
  if (typeof document === 'undefined' || scheduled) return
  scheduled = true
  requestAnimationFrame(() => {
    scheduled = false
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://snack.expo.dev/embed.js'
    document.body.appendChild(s)
  })
}
