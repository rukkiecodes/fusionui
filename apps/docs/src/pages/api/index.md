# API Reference

Every public component in one page. `createFusionUI()` registers all of them
globally, so `<FBtn>` and `<f-btn>` both work with no imports; the named exports
(`import { FBtn } from '@rukkiecodes/vue'`) exist for explicit registration and
for typing. Each row links to the page where that component is documented, and
every page ends with a generated props/events/slots table.

Composables live on their own page — [Composables](/api/composables).

## Layout & Surfaces

| Components                                                                                                                                      | Page                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `FContainer` · `FRow` · `FCol`                                                                                                                  | [Grid](/components/grid)                         |
| `FLayout` · `FMain`                                                                                                                             | [Layout](/components/layout)                     |
| `FSheet`                                                                                                                                        | [Sheet](/components/sheet)                       |
| `FCard` · `FCardGroup` · `FCardTitle` · `FCardText` · `FCardButtons`                                                                            | [Card](/components/card)                         |
| `FDivider` · `FSpacer`                                                                                                                          | [Divider & Spacer](/components/divider)          |
| `FExpansionPanels` · `FExpansionPanel`                                                                                                          | [Expansion Panels](/components/expansion-panels) |
| `FCollapse`                                                                                                                                     | [Collapse](/components/collapse)                 |
| `FHero` · `FCta` · `FFeature` · `FSection` · `FEyebrow` · `FPageHeader` · `FStat` · `FValueCard` · `FStatusPill` · `FOptionCard` · `FCheckList` | [Page Blocks](/components/blocks)                |
| `FAuthLayout`                                                                                                                                   | [Auth Layout](/components/auth-layout)           |

## Buttons & Actions

| Components                                           | Page                                       |
| ---------------------------------------------------- | ------------------------------------------ |
| `FBtn` · `FBtnGroup`                                 | [Button](/components/button)               |
| `FIconBtn`                                           | [Icon Button](/components/icon-button)     |
| `FFab` · `FSpeedDial`                                | [FAB & Speed Dial](/components/fab)        |
| `FItemGroup` · `FItem` · `FBtnToggle` · `FChipGroup` | [Selection Groups](/components/item-group) |

## Form Inputs

| Components                                         | Page                                                |
| -------------------------------------------------- | --------------------------------------------------- |
| `FInput` · `FTextarea` · `FInputNumber` · `FField` | [Text Input](/components/inputs)                    |
| `FSelect`                                          | [Select](/components/select)                        |
| `FAutocomplete` · `FCombobox`                      | [Autocomplete & Combobox](/components/autocomplete) |
| `FCheckbox`                                        | [Checkbox](/components/checkbox)                    |
| `FRadio` · `FRadioGroup`                           | [Radio](/components/radio)                          |
| `FSwitch`                                          | [Switch](/components/switch)                        |
| `FSlider`                                          | [Slider](/components/slider)                        |
| `FRangeSlider`                                     | [Range Slider](/components/range-slider)            |
| `FRating`                                          | [Rating](/components/rating)                        |
| `FOtp`                                             | [OTP Input](/components/otp)                        |
| `FUpload`                                          | [File Upload](/components/upload)                   |
| `FDatePicker` · `FDateInput`                       | [Date Picker](/components/date-picker)              |
| `FTimePicker` · `FTimeInput`                       | [Time Picker](/components/time-picker)              |
| `FColorPicker` · `FColorInput`                     | [Color Picker](/components/color-picker)            |
| `FConfirmEdit`                                     | [Confirm Edit](/components/confirm-edit)            |
| `FForm`                                            | [Form & Validation](/components/form)               |
| `FLabel` · `FMessages` · `FCounter`                | [Labels & Messages](/components/form-chrome)        |

## Data

| Components                           | Page                                                    |
| ------------------------------------ | ------------------------------------------------------- |
| `FDataTable` · `FDataTableServer`    | [Data Table](/components/data-table)                    |
| `FDataIterator`                      | [Data Iterator](/components/data-iterator)              |
| `FTable`                             | [Table](/components/table)                              |
| `FList` · `FListItem`                | [List](/components/list)                                |
| `FTreeview`                          | [Treeview](/components/treeview)                        |
| `FTimeline` · `FTimelineItem`        | [Timeline](/components/timeline)                        |
| `FCalendar`                          | [Calendar](/components/calendar)                        |
| `FVirtualScroll` · `FInfiniteScroll` | [Virtual & Infinite Scroll](/components/virtual-scroll) |
| `FLineChart`                         | [Chart](/components/chart)                              |
| `FSparkline`                         | [Sparkline](/components/sparkline)                      |

## Navigation

| Components                                     | Page                                        |
| ---------------------------------------------- | ------------------------------------------- |
| `FNavbar` · `FNavbarItem` · `FNavbarGroup`     | [Navbar](/components/navbar)                |
| `FSidebar` · `FSidebarItem` · `FSidebarGroup`  | [Sidebar](/components/sidebar)              |
| `FBottomNav` · `FBottomNavItem`                | [Bottom Navigation](/components/bottom-nav) |
| `FSystemBar`                                   | [System Bar](/components/system-bar)        |
| `FFooter`                                      | [Footer](/components/footer)                |
| `FTabs` · `FTab` · `FTabPanel` · `FTabsWindow` | [Tabs](/components/tabs)                    |
| `FBreadcrumb`                                  | [Breadcrumb](/components/breadcrumb)        |
| `FPagination`                                  | [Pagination](/components/pagination)        |
| `FSteps`                                       | [Steps](/components/steps)                  |
| `FWindow` · `FWindowItem`                      | [Window](/components/window)                |
| `FSlideGroup` · `FSlideGroupItem`              | [Slide Group](/components/slide-group)      |

## Feedback & Overlays

| Components                                   | Page                                     |
| -------------------------------------------- | ---------------------------------------- |
| `FAlert`                                     | [Alert](/components/alert)               |
| `FBanner` · `FBannerText` · `FBannerActions` | [Banner](/components/banner)             |
| `FDialog`                                    | [Dialog](/components/dialog)             |
| `FBottomSheet`                               | [Bottom Sheet](/components/bottom-sheet) |
| `FOverlay` · `FPopup`                        | [Overlay & Popup](/components/overlay)   |
| `FMenu`                                      | [Menu](/components/menu)                 |
| `FTooltip`                                   | [Tooltip](/components/tooltip)           |
| `FProgressCircular` · `FProgressLinear`      | [Loading](/components/loading)           |
| `FSkeleton`                                  | [Skeleton](/components/skeleton)         |
| `FEmptyState`                                | [Empty State](/components/empty-state)   |

Notifications, the loading overlay and programmatic dialogs are **services**
rather than components you place — see [Services](#services) below.

## Display

| Components                    | Page                               |
| ----------------------------- | ---------------------------------- |
| `FAvatar` · `FAvatarGroup`    | [Avatar](/components/avatar)       |
| `FBadge`                      | [Badge](/components/badge)         |
| `FChip`                       | [Chip](/components/chip)           |
| `FImage`                      | [Image](/components/image)         |
| `FCarousel` · `FCarouselItem` | [Carousel](/components/carousel)   |
| `FParallax`                   | [Parallax](/components/parallax)   |
| `FKbd` · `FCode`              | [Keyboard & Code](/components/kbd) |
| `FIcon`                       | [Icons](/getting-started/icons)    |

## Signature Layer

| Components | Page                                     |
| ---------- | ---------------------------------------- |
| `FGlass`   | [Liquid Glass](/components/liquid-glass) |
| `FGoo`     | [Goo](/components/goo)                   |

The signature visual layer is
covered on the [Labs](/labs) page, including what stability to expect from it.

## Utilities

| Components                                    | Page                                           |
| --------------------------------------------- | ---------------------------------------------- |
| `FHover` · `FLazy` · `FResponsive` · `FNoSsr` | [Rendering Utilities](/components/rendering)   |
| `FThemeProvider` · `FDefaultsProvider`        | [Theme & Defaults](/components/providers)      |
| `FPullToRefresh`                              | [Pull to Refresh](/components/pull-to-refresh) |

That is the complete registry: 133 components. One name is exported but
deliberately _not_ registered globally — `FTreeviewItem`, the recursion detail
inside `FTreeview`. It is exported for typing only; building its `node` prop by
hand is not a supported use.

## Directives

`createFusionUI()` registers three directives:

| Directive         | What it does                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `v-ripple`        | The ink ripple on press. Already applied inside `FBtn`, `FListItem`, etc.                         |
| `v-click-outside` | Calls the handler when a click lands outside the element — the primitive behind menus and popups. |
| `v-intersect`     | Wraps `IntersectionObserver`; fires when the element enters or leaves the viewport.               |

## Services

Three things are better called than placed. `createFusionUI()` mounts their
hosts for you (pass `services: false` to opt out) and exposes them on
`app.config.globalProperties.$fui`.

| Composable   | Use it for                          | Page                                     |
| ------------ | ----------------------------------- | ---------------------------------------- |
| `useNotify`  | Toast notifications                 | [Notification](/components/notification) |
| `useLoading` | The full-screen loading overlay     | [Loading](/components/loading)           |
| `useDialog`  | Promise-based confirm/alert dialogs | [Dialog](/components/dialog)             |

## Composables

The rest of the public surface — theming, breakpoints, defaults, form state and
the styling primitives you use to build your own components on FusionUI — is
documented in [Composables](/api/composables).

## Utility classes

Spacing, flexbox, sizing, text, borders, elevation, position and opacity are
also available as classes, generated from the same tokens the components use.
Start at [Flexbox](/utilities/flexbox).
