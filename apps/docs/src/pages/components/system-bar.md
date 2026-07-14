# System Bar

`FSystemBar` is a thin status strip that sits above the navbar — the place for a
build tag, a connection state, or a "you are impersonating this user" notice. It
is deliberately small and low-contrast: it is chrome, not content.

## Default

<Example file="system-bar/default" />

## Color

`color` takes a theme colour or any CSS colour — useful for making an environment
banner impossible to miss.

<Example file="system-bar/colors" />

## Window

`window` pins the bar to the top of the viewport so it survives scrolling.

<Example file="system-bar/window" />

## Accessibility

The bar carries `role="status"`, so a change to its contents — going offline,
say — is announced without stealing focus. Keep it terse: a status region that
narrates constantly is worse than none.

## API

<ApiTable name="FSystemBar" />
