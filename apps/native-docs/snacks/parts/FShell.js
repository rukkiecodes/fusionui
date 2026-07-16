// FShell — pure-RN mirror of @rukkiecodes/native FShell. A navbar + sidebar frame
// around recessed content; the junction is the fluid "goo" corner — a convex fillet
// drawn on the GPU with Skia from the shared shell geometry (smin corner, the same
// math as the web shell). Content stays ordinary RN views on top.
const SHELL_QUARTER = 0.4477 // 1 − 0.5523, the quarter-circle Bézier constant

// Rendered inside WithSkiaWeb so CanvasKit is loaded on the web preview. Fills the
// shell-coloured fillet that carves the convex content corner.
function ShellCorner({ size, fill }) {
  const Sk = require('@shopify/react-native-skia')
  const { Canvas, Path, Skia } = Sk
  const s = Math.max(size, 0)
  const c = s * SHELL_QUARTER
  const p = Skia.Path.Make()
  p.moveTo(0, 0)
  p.lineTo(s, 0)
  p.cubicTo(c, 0, 0, c, 0, s)
  p.close()
  return (
    <Canvas style={{ width: s, height: s }}>
      <Path path={p} color={fill} />
    </Canvas>
  )
}

function FShell({
  navbar,
  sidebar,
  navbarHeight = 56,
  sidebarWidth = 220,
  cornerSize = 22,
  shellColor,
  contentColor,
  children,
  style,
}) {
  const shell = shellColor || color('surface')
  const content = contentColor || color('surface-2')
  return (
    <View style={[{ flex: 1, backgroundColor: shell }, style]}>
      {navbar != null ? (
        <View style={{ height: navbarHeight, backgroundColor: shell }}>{navbar}</View>
      ) : null}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {sidebar != null ? (
          <View style={{ width: sidebarWidth, backgroundColor: shell }}>{sidebar}</View>
        ) : null}
        <View style={{ flex: 1, backgroundColor: content }}>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: cornerSize,
              height: cornerSize,
              zIndex: 2,
            }}
          >
            <WithSkiaWeb
              getComponent={() =>
                Promise.resolve({ default: () => <ShellCorner size={cornerSize} fill={shell} /> })
              }
              fallback={null}
            />
          </View>
          {children}
        </View>
      </View>
    </View>
  )
}
