export default function App() {
  return (
    <Screen title="FTooltip — long-press" subtitle="Press and hold the tile to reveal the tip.">
      <Panel caption="Long-press me">
        <FTooltip text="Tooltips on touch are long-press popovers — there is no hover on a phone.">
          <View
            style={{
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: T.radius.md,
              backgroundColor: withAlpha(color('primary'), 0.14),
            }}
          >
            <Text style={{ color: color('primary'), fontWeight: '600' }}>Press &amp; hold</Text>
          </View>
        </FTooltip>
      </Panel>
    </Screen>
  )
}
