# Glassmorphism Component Guide

## Where glass is appropriate
Prefer glass for sticky top bars and floating navigation surfaces, small floating controls and menus, dialogs/popovers/focused overlays, and a limited number of emphasis panels where background separation improves hierarchy.

Prefer solid or nearly solid surfaces for data tables and dense information, forms and validation messages, charts with labels and legends, risk warnings and urgent actions, and long advisory text and decision evidence.

## Surface anatomy
A reusable glass surface may combine:
1. Theme-aware translucent background.
2. Backdrop blur and optional saturation.
3. Thin, low-contrast border.
4. Subtle inset highlight.
5. Restrained shadow.
6. Stable text and icon colors.

The background behind a glass surface should remain visually quiet enough to preserve legibility.

## Theme considerations
### Light
Use a light translucent surface, subtle cool/green border, dark text, and restrained shadows.

### Dark
Use a deep green/charcoal translucent surface, subtle light border, light text, and darker shadows. Do not reuse light-mode text or border values blindly.

## Interaction states
- Hover: subtle border or elevation change, not a large jump.
- Focus: clearly visible outline or ring.
- Active: visibly pressed or selected.
- Disabled: muted while retaining legibility.
- Loading: communicate the pending action without suggesting completion.

## Performance and fallback
- Keep blur strength reasonable on low-powered devices.
- Include the WebKit backdrop-filter variant where needed for browser compatibility.
- Define an opaque background fallback.
- Avoid animating large blurred regions unnecessarily.
- Test contrast with actual content and background, not only in a component gallery.

Apply these guidelines to existing components rather than introducing a second parallel UI framework.