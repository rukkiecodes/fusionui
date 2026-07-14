# Treeview

`FTreeview` renders a hierarchy — a file tree, an org chart, a permission set —
from a nested `items` array. Branches open and close, nodes can be selectable
(with a real cascade), activatable, searchable and lazily loaded.

It is a proper `role="tree"` with a roving tabindex, so the whole thing works
from the keyboard: <kbd>↓</kbd>/<kbd>↑</kbd> walk the visible nodes,
<kbd>→</kbd> opens a branch and then steps into it, <kbd>←</kbd> closes it and
then steps out to the parent, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first
and last node, <kbd>Enter</kbd> activates (or opens), <kbd>Space</kbd> toggles a
checkbox, and <kbd>\*</kbd> expands every branch alongside the focused one.

## Default

Each item needs a title and a value, and a branch is any item with a `children`
array. Those keys are `item-title`, `item-value` and `item-children` — property
names or getter functions — defaulting to `title`, `value` and `children`. Seed
the open branches with `opened`; an item marked `disabled` sits the tree out.

<Example file="treeview/basic" />

## Opening

`v-model:opened` holds the ids of the open branches, `open-all` starts everything
expanded (and keeps up with branches that appear later), and
`open-strategy="single"` turns the tree into an accordion — opening a branch
closes its siblings. Clicking a branch row opens it by default; `open-on-click`
overrides that either way.

<Example file="treeview/opened" />

## Selection

`selectable` puts a checkbox on each node. `select-strategy` decides which nodes
get one and what a click writes to `v-model:selected`: `leaf` (the default) only
checks leaves, `independent` gives every node its own checkbox with no
relationship to any other.

<Example file="treeview/selectable" />

### Classic cascade

`select-strategy="classic"` is the familiar file-picker behavior: checking a
branch checks every leaf below it, unchecking clears them, and a branch whose
descendants are only partly checked renders indeterminate (and is announced as
`aria-checked="mixed"`). Only leaves are ever written to the model — a branch's
state is derived from them, never stored — and disabled leaves are left alone.

<Example file="treeview/classic" />

## Activatable

`activatable` makes a row click select the node rather than open it (the chevron
still opens the branch). `v-model:activated` holds the active id — or ids, with
`multiple-active` — and `click:activate` fires with `{ id, value, item }`. This
is the mode you want for a navigation tree that drives a detail pane.

<Example file="treeview/activatable" />

## Search

`search` filters the tree in place: matching nodes stay, along with every
ancestor on the path to them (so a match is never orphaned) and everything below
them. Surviving branches are forced open while the search is live. Replace the
match with `custom-filter` — `(item, search) => boolean`.

<Example file="treeview/search" />

## Lazy loading

Give a branch an empty `children` array and it renders as expandable but
unloaded. The first time it is opened, `load-children` is called with the raw
item, the node shows a spinner (and `aria-busy`), and you push the children onto
the item when the request settles.

<Example file="treeview/lazy" />

## Slots

`prepend` and `append` decorate a row on either side of the title, and `title`
replaces the label. All three receive
`{ item, node, level, isOpen, isSelected, isIndeterminate, isActive, isLoading }`.
`no-data` covers an empty tree (or a search that matched nothing).

<Example file="treeview/slots" />

## API

<ApiTable name="FTreeview" />
