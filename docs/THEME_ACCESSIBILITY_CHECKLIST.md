# Theme and Accessibility Checklist

Use this checklist during implementation and review. Mark an item complete only after testing it.

## Theme behavior
- [ ] Light theme text and controls remain readable on every surface.
- [ ] Dark theme text and controls remain readable on every surface.
- [ ] Semantic success, warning, and danger states remain distinguishable in both themes.
- [ ] Theme toggle has a clear accessible name and visible focus.
- [ ] Theme preference behaves consistently after navigation and refresh, if persistence is implemented.
- [ ] No unexpected flash of the wrong theme during initial render.
- [ ] Glass surfaces have a solid-color fallback when backdrop blur is unavailable.

## Keyboard and semantics
- [ ] All interactive controls can be reached by keyboard.
- [ ] Focus indicators are visible against light and dark surfaces.
- [ ] Links and buttons use the correct semantic element.
- [ ] Disabled and loading controls communicate their state.
- [ ] Icon-only controls have accessible names.
- [ ] Status is not communicated by color alone.

## Motion and effects
- [ ] Animation is restrained and does not obscure data.
- [ ] Reduced-motion preferences are respected.
- [ ] Hover effects have an equivalent keyboard-focus state.
- [ ] Blur and transparency do not reduce text legibility.

## Responsive behavior
- [ ] No horizontal page overflow at narrow widths.
- [ ] Cards and metric groups reflow cleanly.
- [ ] Navigation remains usable on touch screens.
- [ ] Buttons retain usable touch targets and do not overlap.
- [ ] Long labels and translated content do not break layouts.

This checklist is a review aid, not a claim of formal accessibility certification.