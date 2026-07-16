// FTooltip — pure-RN mirror of @rukkiecodes/native FTooltip. Web tooltips are hover-
// driven; touch has no hover, so the native contract is long-press → a small popover.
function FTooltip({ text, children, delay = 300 }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Pressable onLongPress={() => setOpen(true)} delayLongPress={delay} accessibilityHint={text}>
        {children}
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 32,
          }}
        >
          <View
            style={{
              maxWidth: '86%',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: T.radius.md,
              backgroundColor: color('on-surface'),
            }}
          >
            <Text style={{ color: color('surface'), fontSize: 14, lineHeight: 20 }}>{text}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
