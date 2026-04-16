# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AVISENS is a **static-only** (no backend, no build system) poultry farm management web app — plain HTML, CSS, and vanilla JavaScript. All data is hardcoded in JS. Open any `.html` file directly in a browser or serve with any static file server.

```bash
# Quick local server
python3 -m http.server 8080
# or
npx serve .
```

## Role Architecture (3 roles)

| Role | Folder | Credentials | Access |
|------|--------|-------------|--------|
| **Avisens** | `views/avisens/` | avisens / admin123 | Super admin — manages all client farms |
| **Usuario** | `views/usuario/` | usuario / admin123 | Farm owner/client — full operational management |
| **Operario** | `views/operario/` | operario / oper123 | Field worker — read-only + manual controls |

Navigation flow:
```
index.html (landing)
  └─ views/login.html  (3-role selector with demo credential pre-fill)
        ├─ views/avisens/dashboard.html   (multi-farm super admin panel)
        ├─ views/usuario/dashboard.html   (main operational app)
        └─ views/operario/dashboard.html  (limited field worker panel)
```

## Usuario Module (main app — most complete)

Each page in `views/usuario/` follows the same pattern:
- **HTML file** — sidebar nav + top header + main content + mobile bottom nav
- **Paired JS file** — `views/usuario/js/<page>.js` — all interactivity
- **Shared JS** — `views/usuario/js/utils.js` — loaded last on every page (see below)
- **Shared CSS** — `views/usuario/css/style.css` — single stylesheet for the whole module

### Page ↔ JS mapping

| Page | JS file | Responsibility |
|------|---------|----------------|
| `dashboard.html` | *(none, only utils.js)* | KPI cards, galpón status grid, recent alerts |
| `monitoreo.html` | `monitoreo.js` | Sensors + Alerts + Automation (3 unified tabs) |
| `curvas.html` | `curvas.js` | Growth-curve weight logging |
| `inventario.html` | `inventario.js` | Stock / Requisitions / Movement history (3 tabs) |
| `operadores.html` | `operadores.js` | Tasks / Operators / Consumptions (3 tabs) |

### Global utilities (`utils.js`)

Exposes globals used by every page:
- `showToast(type, title, message, duration)` — `type`: `'success' | 'error' | 'warning' | 'info'`
- `openModal(id)` / `closeModal(id)` — toggle `.hidden` on `.modal-overlay`
- `showConfirm(title, message, onConfirm, onCancel)` — custom confirm (replaces `confirm()`)
- `exportToCSV(filename, headers, rows)` — client-side CSV download
- `formatTimestamp(date)` — returns `YYYY-MM-DD HH:MM`
- `cerrarSesion()` — confirms then redirects to `../login.html`

### CSS design tokens

All colors are CSS variables in `:root` at the top of `views/usuario/css/style.css`:

| Variable | Value | Meaning |
|----------|-------|---------|
| `--status-optimal` | `#10b981` | Green — normal range |
| `--status-warning` | `#f59e0b` | Amber — attention needed |
| `--status-critical` | `#ef4444` | Red — immediate action |
| `--status-info` | `#3b82f6` | Blue — informational |
| `--bg-primary` | `#0a1612` | Page background |
| `--border-color` | `#1a2e26` | Card/input borders |

**Never hardcode hex colors inline** — always use the CSS variables. The same token set is copied to `views/avisens/style.css`, `views/operario/style.css`, and `views/css-login/style.css`.

### Status / badge system

HTML `data-status`, CSS classes, and JS logic all use the same 4 values:
`optimal` | `warning` | `critical` | `info` → CSS badges: `optimal-badge`, `warning-badge`, `critical-badge`, `info-badge`

## Sensor thresholds (per brief)

| Parameter | Optimal | Warning | Critical |
|-----------|---------|---------|---------|
| Temperatura | 22–26°C | 18–22 / 26–30 | <18 or >30 |
| Humedad | 50–70% | 40–50 / 70–80 | <40 or >80 |
| CO₂ | <3,000 ppm | 3,000–5,000 | >5,000 |
| Amoníaco (NH₃) | <20 ppm | 20–35 | >35 |

## Mock data reference (4 galpones)

| Galpón | Temp | Hum | CO₂ | NH₃ | Aves | Día | Estado |
|--------|------|-----|-----|-----|------|-----|--------|
| 1 | 22°C | 65% | 2,200 ppm | 18 ppm | 15,000 | 28 | Óptimo |
| 2 | 26°C | 58% | 2,800 ppm | 22 ppm | 14,500 | 35 | Advertencia |
| 3 | 20°C | 72% | 1,800 ppm | 15 ppm | 15,200 | 21 | Óptimo |
| 4 | 28°C | 48% | 3,200 ppm | 28 ppm | 14,800 | 42 | Crítico |

## Key constraints

- **Do not modify `views/css-login/style.css`** structure — shared login stylesheet.
- Each role folder is self-contained (its own CSS, utils.js, and img/).
- All state is in-memory DOM only — page refresh resets everything. No persistence layer.
- The farm owner (usuario) is hardcoded as "Juan Martínez" throughout the JS files.
- The avisens and operario dashboards are single-page prototypes; their sub-pages (granjas, alertas, control) are placeholders showing `showToast('info','Próximamente',...)`.
- The `AVISENS-PROJECT-BRIEF.md` at the project root is the authoritative product spec. Refer to it for sensor ranges, feature descriptions, color palette, and stack decisions.
