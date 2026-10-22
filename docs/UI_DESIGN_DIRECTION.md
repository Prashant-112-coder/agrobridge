# AGROBRIDGE UI Design Direction

## Approved direction
- **Primary style:** Minimal.
- **Secondary style:** iPhone-standard glassmorphism.
- **Color modes:** Light and dark.
- **Shape language:** Rounded cards, pills, and controls.
- **Brand feel:** Calm, trustworthy, agriculture-focused, and data-led.

## Visual principles
1. **Content before decoration.** Farm health, source evidence, risks, and recommended actions must be easier to scan than decorative effects.
2. **Use glass selectively.** Reserve frosted surfaces for the top bar, floating controls, overlays, and selected emphasis panels. Do not make every card transparent.
3. **Preserve hierarchy across themes.** Light and dark modes should use the same information architecture, spacing, and component hierarchy.
4. **Use restrained color.** Forest green and mint communicate the brand; status colors should retain meaning and must not rely on color alone.
5. **Maintain readable surfaces.** Charts, tables, forms, alerts, and long text need stable, high-contrast backgrounds.
6. **Keep responsive behavior intentional.** Navigation, metric groups, and action buttons must adapt to small screens without horizontal overflow.

## Glass surface recipe
- Translucent surface fill appropriate to the active theme.
- Backdrop blur and saturation where supported.
- Fine border and subtle top-edge highlight.
- Soft, restrained shadow.
- Solid or mostly opaque fallback when backdrop blur is unavailable.

## Avoid
- Glass effects on every element.
- Low-contrast text over busy backgrounds.
- Strong neon gradients or heavy shadows.
- Styling that implies live data or a diagnosis the application has not actually produced.
- Replacing existing working components with static mockups.

## Scope
Apply this direction to the existing shared layout and these pages: Dashboard, Diagnostics, Crop Doctor, Pomegranate AI Portal, Mandi Rates, Advisory Dossier, and Field Health & Weather History.

This document describes the design direction; it does not claim that every item has been independently tested or implemented.