# Theme images

Static images live in **`frontend/public/images/`**. Vite copies them to **`assets/images/`** on `npm run build` (alongside `app.js` / `app.css`).

Do not put PNGs directly in `assets/` — `emptyOutDir` clears that folder on each build.

## File map

| File | Used in |
|------|---------|
| `Logo.png` | Header & footer (fallback when no logo in theme settings) |
| `hero_bg.png` | Hero section (fallback when no image picker image) |
| `icon_pcos.png` | Categories — PCOS |
| `icon_hormonal.png` | Categories — Hormonal balance |
| `icon_fatloss.png` | Categories — Fat loss |
| `icon_sleep.png` | Categories — Sleep |
| `img_founder.png` | Founder section (fallback) |
| `tick_icon.png` | Trust & quality — badge 1 |
| `lab_icon.png` | Trust & quality — badge 2 |
| `thumb_icon.png` | Trust & quality — badge 3 |

Reference in Liquid: `{{ 'images/hero_bg.png' | asset_url }}`

Upload a logo in **Theme settings → Brand** to replace the SVG fallback.
