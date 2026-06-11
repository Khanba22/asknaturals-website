# Theme assets

Built JS/CSS and static files live in **`assets/`** after `npm run build`.

Source static files go in **`frontend/public/`** (copied to `assets/` on build).

## Hero scroll videos

Place source MP4s in **`frontend/videos-source/`**, then encode:

```bash
npm run encode:hero
```

Outputs:

| File | Used in |
|------|---------|
| `desktop_animation.mp4` | Hero — desktop scroll scrub |
| `mobile_animation.mp4` | Hero — mobile scroll scrub |

Or upload videos in **Theme Editor → Hero** (overrides theme assets).

## Static images

| File | Used in |
|------|---------|
| `Logo.png` | Header & footer (fallback) |
| `hero_bg.png` | Legacy fallback image |
| `icon_pcos.png` | Categories — PCOS |
| `icon_hormonal.png` | Categories — Hormonal balance |
| `icon_fatloss.png` | Categories — Fat loss |
| `icon_sleep.png` | Categories — Sleep |
| `img_founder.png` | Founder section (fallback) |
| `tick_icon.png` | Trust & quality — badge 1 |
| `lab_icon.png` | Trust & quality — badge 2 |
| `thumb_icon.png` | Trust & quality — badge 3 |

Reference in Liquid: `{{ 'Logo.png' | asset_url }}`

Upload a logo in **Theme settings → Brand** to replace the PNG fallback.
