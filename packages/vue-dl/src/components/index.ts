import type { Component } from 'vue'
import { VdIcon } from './VdIcon'
import { VdBtn } from './VdBtn'
import { VdBtnGroup } from './VdBtnGroup'
import { VdCard, VdCardTitle, VdCardSubtitle, VdCardText, VdCardActions } from './VdCard'
import { VdAlert } from './VdAlert'
import { VdChip } from './VdChip'
import { VdAvatar } from './VdAvatar'
import { VdBadge } from './VdBadge'
import { VdProgressCircular, VdProgressLinear } from './VdProgress'
import { VdDivider } from './VdDivider'
import { VdSpacer } from './VdSpacer'

export * from './VdIcon'
export * from './VdBtn'
export * from './VdBtnGroup'
export * from './VdCard'
export * from './VdAlert'
export * from './VdChip'
export * from './VdAvatar'
export * from './VdBadge'
export * from './VdProgress'
export * from './VdDivider'
export * from './VdSpacer'

/** Built-in components registered globally by createVueDL().install. */
export const components: Record<string, Component> = {
  VdIcon,
  VdBtn,
  VdBtnGroup,
  VdCard,
  VdCardTitle,
  VdCardSubtitle,
  VdCardText,
  VdCardActions,
  VdAlert,
  VdChip,
  VdAvatar,
  VdBadge,
  VdProgressCircular,
  VdProgressLinear,
  VdDivider,
  VdSpacer,
}
