/**
 * FTooltip — a hint shown on long-press. Web tooltips are hover-driven; touch
 * has no hover, so the native contract is long-press → a small popover (an
 * accepted, documented platform divergence). Mirrors the web `<f-tooltip>` text.
 */

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { useFusionTheme } from '../theme'

export interface FTooltipProps {
  text: string
  /** The trigger element. */
  children: ReactNode
  /** Long-press delay in ms (default 300). */
  delay?: number
}

export function FTooltip({ text, children, delay = 300 }: FTooltipProps) {
  const theme = useFusionTheme()
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
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors['on-surface'],
            }}
          >
            <Text style={{ color: theme.colors.surface, fontSize: 14, lineHeight: 20 }}>
              {text}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
