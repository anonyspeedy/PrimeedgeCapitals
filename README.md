# PrimeedgeCapitals

A responsive trader dashboard UI built with Vite, React 18, TypeScript and Tailwind v4.

## Getting started

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Features

- **11 dashboard sections** — Accounts, Payout, Competitions, Certificates, Transactions, Refer & Earn, My Offers, Economic Calendar, Calculator and Profile & KYC.
- **Two distinct responsive layouts** — a fixed rail sidebar and topbar page titles on desktop (`≥1280px`), versus a slide-in sheet drawer with in-page titles on smaller screens.
- **Light and dark themes** — toggled from the topbar and persisted to `localStorage`.
- **Accessible colour tokens** — all text meets WCAG AA contrast in both themes.
- **No runtime dependencies beyond React** — routing is in-app state, all visuals are CSS/SVG drawn, and all data is sample data.

Verified across 10 viewport widths from 320px to 1920px with no horizontal overflow.

## Project structure

```
src/
  App.tsx                      app shell: theme, routing, mobile drawer
  styles.css                   design tokens and Tailwind v4 @theme config
  components/
    Sidebar.tsx                desktop rail + mobile sheet navigation
    Topbar.tsx                 sticky header, search, notifications, avatar menu
    ui.tsx                     primitives: Button, Badge, Segmented, Card, ...
    widgets.tsx                charts, sparklines, stat tiles
    pages/
      AccountsPage.tsx         main dashboard + account detail view
      sections.tsx             the nine remaining sections
  lib/
    nav.ts                     route ids and navigation config
    data.ts                    sample records
    format.ts                  currency/date formatting helpers
```
