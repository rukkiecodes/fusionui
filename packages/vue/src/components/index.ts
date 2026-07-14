import type { Component } from 'vue'
import { FIcon } from './FIcon'
import { FBtn } from './FBtn'
import { FBtnGroup } from './FBtnGroup'
import { FCard, FCardGroup, FCardTitle, FCardText, FCardButtons } from './FCard'
import { FAlert } from './FAlert'
import { FChip } from './FChip'
import { FAvatar, FAvatarGroup } from './FAvatar'
import { FBadge } from './FBadge'
import { FProgressCircular, FProgressLinear } from './FProgress'
import { FDivider } from './FDivider'
import { FSpacer } from './FSpacer'
import { FContainer } from './FContainer'
import { FRow } from './FRow'
import { FCol } from './FCol'
import { FField } from './FField'
import { FInput } from './FInput'
import { FTextarea } from './FTextarea'
import { FInputNumber } from './FInputNumber'
import { FSelect } from './FSelect'
import { FOtp } from './FOtp'
import { FCheckbox } from './FCheckbox'
import { FRadio, FRadioGroup } from './FRadioGroup'
import { FSwitch } from './FSwitch'
import { FSlider } from './FSlider'
import { FUpload } from './FUpload'
import { FForm } from './FForm'
import { FOverlay } from './FOverlay'
import { FPopup } from './FPopup'
import { FDialog } from './FDialog'
import { FMenu } from './FMenu'
import { FTooltip } from './FTooltip'
import { FList, FListItem } from './FList'
import { FTabs, FTab, FTabPanel, FTabsWindow } from './FTabs'
import { FCarousel, FCarouselItem } from './FCarousel'
import { FImage } from './FImage'
import { FNavbar, FNavbarItem, FNavbarGroup } from './FNavbar'
import { FSidebar, FSidebarItem, FSidebarGroup } from './FSidebar'
import { FBreadcrumb } from './FBreadcrumb'
import { FPagination } from './FPagination'
import { FCollapse } from './FCollapse'
import { FTable } from './FTable'
import { FGlass } from './FGlass'
import { FGoo } from './FGoo'
import { FLineChart } from './FLineChart'
import { FStat } from './FStat'
import { FFeature } from './FFeature'
import { FSection } from './FSection'
import { FSteps } from './FSteps'
import { FCta } from './FCta'
import { FCheckList } from './FCheckList'
import { FEyebrow } from './FEyebrow'
import { FValueCard } from './FValueCard'
import { FHero } from './FHero'
import { FEmptyState } from './FEmptyState'
import { FPageHeader } from './FPageHeader'
import { FStatusPill } from './FStatusPill'
import { FAuthLayout } from './FAuthLayout'
import { FOptionCard } from './FOptionCard'
import { FLayout } from './FLayout'
import { FMain } from './FMain'
import { FSheet } from './FSheet'
import { FKbd } from './FKbd'
import { FCode } from './FCode'
import { FBanner, FBannerText, FBannerActions } from './FBanner'
import { FFooter } from './FFooter'
import { FSkeleton } from './FSkeleton'
import { FTimeline, FTimelineItem } from './FTimeline'
import { FLabel } from './FLabel'
import { FMessages } from './FMessages'
import { FCounter } from './FCounter'
import { FThemeProvider } from './FThemeProvider'
import { FDefaultsProvider } from './FDefaultsProvider'
import { FIconBtn } from './FIconBtn'
import { FItemGroup, FItem } from './FItemGroup'
import { FBtnToggle } from './FBtnToggle'
import { FChipGroup } from './FChipGroup'
import { FWindow, FWindowItem } from './FWindow'
import { FSlideGroup, FSlideGroupItem } from './FSlideGroup'
import { FExpansionPanels, FExpansionPanel } from './FExpansionPanels'
import { FPullToRefresh } from './FPullToRefresh'
import { FFab } from './FFab'
import { FSpeedDial } from './FSpeedDial'
import { FBottomNav, FBottomNavItem } from './FBottomNav'
import { FBottomSheet } from './FBottomSheet'
import { FAutocomplete } from './FAutocomplete'
import { FCombobox } from './FCombobox'
import { FConfirmEdit } from './FConfirmEdit'
import { FVirtualScroll } from './FVirtualScroll'
import { FInfiniteScroll } from './FInfiniteScroll'
import { FSparkline } from './FSparkline'
import { FDataTable, FDataTableServer } from './FDataTable'
import { FDataIterator } from './FDataIterator'
// FTreeviewItem is intentionally not imported: it is re-exported for typing by
// `export * from './FTreeview'`, but never registered globally (see the map below).
import { FTreeview } from './FTreeview'
import { FDatePicker } from './FDatePicker'
import { FDateInput } from './FDateInput'
import { FTimePicker, FTimeInput } from './FTimePicker'
import { FColorPicker, FColorInput } from './FColorPicker'
import { FCalendar } from './FCalendar'
import { FRating } from './FRating'
import { FRangeSlider } from './FRangeSlider'
import { FSystemBar } from './FSystemBar'
import { FParallax } from './FParallax'
import { FHover } from './FHover'
import { FLazy } from './FLazy'
import { FResponsive } from './FResponsive'
import { FNoSsr } from './FNoSsr'

export * from './FIcon'
export * from './FBtn'
export * from './FBtnGroup'
export * from './FCard'
export * from './FAlert'
export * from './FChip'
export * from './FAvatar'
export * from './FBadge'
export * from './FProgress'
export * from './FDivider'
export * from './FSpacer'
export * from './FContainer'
export * from './FRow'
export * from './FCol'
export * from './FField'
export * from './FInput'
export * from './FTextarea'
export * from './FInputNumber'
export * from './FSelect'
export * from './FOtp'
export * from './FCheckbox'
export * from './FRadioGroup'
export * from './FSwitch'
export * from './FSlider'
export * from './FUpload'
export * from './FForm'
export * from './FOverlay'
export * from './FPopup'
export * from './FDialog'
export * from './FMenu'
export * from './FTooltip'
export * from './FList'
export * from './FTabs'
export * from './FCarousel'
export * from './FImage'
export * from './FNavbar'
export * from './FSidebar'
export * from './FBreadcrumb'
export * from './FPagination'
export * from './FCollapse'
export * from './FTable'
export * from './FGlass'
export * from './FGoo'
export * from './FLineChart'
export * from './FStat'
export * from './FFeature'
export * from './FSection'
export * from './FSteps'
export * from './FCta'
export * from './FCheckList'
export * from './FEyebrow'
export * from './FValueCard'
export * from './FHero'
export * from './FEmptyState'
export * from './FPageHeader'
export * from './FStatusPill'
export * from './FAuthLayout'
export * from './FOptionCard'
export * from './FLayout'
export * from './FMain'
export * from './FSheet'
export * from './FKbd'
export * from './FCode'
export * from './FBanner'
export * from './FFooter'
export * from './FSkeleton'
export * from './FTimeline'
export * from './FLabel'
export * from './FMessages'
export * from './FCounter'
export * from './FThemeProvider'
export * from './FDefaultsProvider'
export * from './FIconBtn'
export * from './FItemGroup'
export * from './FBtnToggle'
export * from './FChipGroup'
export * from './FWindow'
export * from './FSlideGroup'
export * from './FExpansionPanels'
export * from './FPullToRefresh'
export * from './FFab'
export * from './FSpeedDial'
export * from './FBottomNav'
export * from './FBottomSheet'
export * from './FAutocomplete'
export * from './FCombobox'
export * from './FConfirmEdit'
export * from './FVirtualScroll'
export * from './FInfiniteScroll'
export * from './FSparkline'
export * from './FDataTable'
export * from './FDataIterator'
export * from './FTreeview'
export * from './FDatePicker'
export * from './FDateInput'
export * from './FTimePicker'
export * from './FColorPicker'
export * from './FCalendar'
export * from './FRating'
export * from './FRangeSlider'
export * from './FSystemBar'
export * from './FParallax'
export * from './FHover'
export * from './FLazy'
export * from './FResponsive'
export * from './FNoSsr'

/** Built-in components registered globally by createFusionUI().install. */
export const components: Record<string, Component> = {
  FIcon,
  FBtn,
  FBtnGroup,
  FCard,
  FCardGroup,
  FCardTitle,
  FCardText,
  FCardButtons,
  FAlert,
  FChip,
  FAvatar,
  FAvatarGroup,
  FBadge,
  FProgressCircular,
  FProgressLinear,
  FDivider,
  FSpacer,
  FContainer,
  FRow,
  FCol,
  FField,
  FInput,
  FTextarea,
  FInputNumber,
  FSelect,
  FOtp,
  FCheckbox,
  FRadio,
  FRadioGroup,
  FSwitch,
  FSlider,
  FUpload,
  FForm,
  FOverlay,
  FPopup,
  FDialog,
  FMenu,
  FTooltip,
  FList,
  FListItem,
  FTabs,
  FTab,
  FTabPanel,
  FTabsWindow,
  FCarousel,
  FCarouselItem,
  FImage,
  FNavbar,
  FNavbarItem,
  FNavbarGroup,
  FSidebar,
  FSidebarItem,
  FSidebarGroup,
  FBreadcrumb,
  FPagination,
  FCollapse,
  FTable,
  FGlass,
  FGoo,
  FLineChart,
  FStat,
  FFeature,
  FSection,
  FSteps,
  FCta,
  FCheckList,
  FEyebrow,
  FValueCard,
  FHero,
  FEmptyState,
  FPageHeader,
  FStatusPill,
  FAuthLayout,
  FOptionCard,
  FLayout,
  FMain,
  // ---- surfaces & typography ----
  FSheet,
  FKbd,
  FCode,
  FBanner,
  FBannerText,
  FBannerActions,
  FFooter,
  FSkeleton,
  FTimeline,
  FTimelineItem,
  // ---- form chrome & providers ----
  FLabel,
  FMessages,
  FCounter,
  FThemeProvider,
  FDefaultsProvider,
  FIconBtn,
  // ---- selection groups ----
  FItemGroup,
  FItem,
  FBtnToggle,
  FChipGroup,
  FWindow,
  FWindowItem,
  FSlideGroup,
  FSlideGroupItem,
  FExpansionPanels,
  FExpansionPanel,
  // ---- actions & navigation ----
  FPullToRefresh,
  FFab,
  FSpeedDial,
  FBottomNav,
  FBottomNavItem,
  FBottomSheet,
  // ---- advanced inputs ----
  FAutocomplete,
  FCombobox,
  FConfirmEdit,
  FDatePicker,
  FDateInput,
  FTimePicker,
  FTimeInput,
  FColorPicker,
  FColorInput,
  FCalendar,
  FRating,
  FRangeSlider,
  // ---- rendering utilities ----
  FSystemBar,
  FParallax,
  FHover,
  FLazy,
  FResponsive,
  FNoSsr,
  // ---- data ----
  FVirtualScroll,
  FInfiniteScroll,
  FSparkline,
  FDataTable,
  FDataTableServer,
  FDataIterator,
  FTreeview,
  // FTreeviewItem is deliberately NOT registered globally: it is an internal
  // recursion detail of FTreeview (its `node` prop is not meant to be built by
  // hand) and it throws without the tree's context. It stays exported for typing.
}
