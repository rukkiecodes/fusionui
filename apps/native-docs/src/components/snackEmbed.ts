// Shared, page-singleton loader for Expo Snack's embed.js.
//
// embed.js scans the DOM for [data-snack-code]/[data-snack-id] elements and swaps
// each for a snack.expo.dev player iframe. With several <NativeSnack> on one page
// we want exactly ONE scan after they've all mounted — so calls in the same frame
// collapse to a single appended script (which re-runs the scan, covering SPA nav).
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
