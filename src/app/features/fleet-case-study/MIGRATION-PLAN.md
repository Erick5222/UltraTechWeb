# FleetControl Case Study — Migration Plan

> **Status:** ETAPA 2 complete — reusable demo components prepared in `ultra-tech-web`.  
> **Not integrated** into site navigation yet.  
> **FleetControlFront** was not modified.

## Goal

Embed the FleetControl operations dashboard as an **interactive portfolio case study** inside Ultra Tech, using **mock data only** (no backend, no auth, no environment API keys).

---

## What was prepared

```
src/app/features/fleet-case-study/
├── index.ts                          # Public exports
├── fleet-case-study.ts               # Root embed component (<app-fleet-case-study />)
├── fleet-case-study.html|scss
├── fleet-case-study.providers.ts     # Scoped DI (isolated from main app)
├── MIGRATION-PLAN.md                 # This file
├── styles/_variables.scss            # FleetControl design tokens (scoped via includePaths)
├── shared/
│   ├── components/status-pill/
│   └── utils/fleet-format.utils.ts
├── layout/
│   ├── fleet-case-study-shell/       # Demo shell (top bar + dashboard)
│   ├── case-study-top-bar/           # Visual header (no auth actions)
│   └── status-summary/               # KPI strip
└── dashboard/
    ├── components/                   # Map, units list, details, charts, cards…
    ├── state/dashboard-state.service.ts
    ├── services/                     # Map, charts helpers, mock data layer
    ├── models/                       # API-shaped types
    ├── mocks/                        # fleet.mock.ts + mock-fleet-store.ts
    └── config/
```

### Public API

```typescript
import { FleetCaseStudyComponent, FLEET_CASE_STUDY_PROVIDERS } from './features/fleet-case-study';
```

Embed (when integrating):

```html
<app-fleet-case-study />
```

---

## Isolated / removed for portfolio

| Removed or replaced | Reason |
|---------------------|--------|
| HTTP services (`DashboardService`, `UnitService`, `TelemetryService`, `AlertService`, `FleetConfigService`) | Backend not needed |
| `environment.ts` / `apiUrl` | No external API |
| `proxy.conf.json` | Dev proxy not needed |
| `DashboardPollingService` | Replaced by `DemoLiveUpdatesService` (no-op) |
| `http-retry.operator.ts` | HTTP-only |
| Side nav + logout + user avatar actions | Auth / app shell not needed |
| Notification & settings buttons in top bar | Auth / app logic removed; visual demo badge added |

## Preserved

- Full dashboard UI grid (map + units + details)
- Leaflet map + CARTO dark tiles
- OSRM routing (optional; falls back to straight lines offline)
- ApexCharts fuel telemetry chart
- Status pills, cards, filters, search
- SCSS variables, animations, responsive breakpoints
- `DashboardStateService` interaction model (select unit → map + detail update)

---

## Mock data architecture

```
fleet.mock.ts          → Rich demo units (TRK-502, TRK-410, …)
        ↓
mock-fleet-store.ts    → Maps legacy mock → API-shaped models
        ↓
dashboard-data.service.ts → Returns Observables with small delay (simulates load)
        ↓
dashboard-state.service.ts → Same UX as production dashboard
```

**No network calls** except optional map tile/routing CDN requests.

To change demo content, edit `dashboard/mocks/fleet.mock.ts` or extend `mock-fleet-store.ts`.

---

## Dependencies added to ultra-tech-web

```json
"leaflet": "^1.9.4",
"apexcharts": "^5.10.3",
"ng-apexcharts": "^2.4.0",
"@types/leaflet": "^1.9.21"
```

### angular.json updates

- Global `leaflet.css`
- `stylePreprocessorOptions.includePaths`: `src/app/features/fleet-case-study`
- `allowedCommonJsDependencies`: `["leaflet"]`

---

## Provider scoping

`FLEET_CASE_STUDY_PROVIDERS` registers services **only on** `FleetCaseStudyComponent`:

- `DashboardStateService`
- `DashboardDataService` (mock)
- `DemoLiveUpdatesService`
- `MapRoutingService`
- `ClockService`
- `FuelProjectionService`

This avoids polluting the main Ultra Tech app injector.

---

## ETAPA 3–5 — Integration status

Integrated on the **Home** page case study section (`src/app/features/home/case-study/`):

- Copy + capabilities + metrics on top
- Interactive `app-fleet-case-study-shell` below (lazy-loaded on viewport)
- Mock data only; scoped providers on `CaseStudy` component

Standalone preview remains available via `<app-fleet-case-study />`.

---

## ETAPA 4 — Optional enhancements

- [ ] Wire `FuelProjectionChartComponent` into telemetry panel (component exists, unused)
- [ ] Simulated live telemetry in mock store (timer updating speed/fuel)
- [ ] Extract to `projects/fleet-dashboard-ui` library if reused across pages
- [ ] i18n for hardcoded Spanish strings in dashboard UI
- [ ] Dedicated spec tests for `MockFleetStore` and embed component

---

## Verification

```bash
npm run build   # Must pass (verified)
```

To manually preview before routing integration, temporarily add `<app-fleet-case-study />` to a dev-only page or the portfolio shell, then remove after QA.

---

## Source of truth

Original implementation remains in **FleetControlFront** (`C:\Users\Erick Gonzalez\Desktop\Exc\FleetControl\FleetControlFront`).  
This folder is a **portfolio-adapted copy** maintained inside **ultra-tech-web** only.
