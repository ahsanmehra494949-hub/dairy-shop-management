# Dairy Shop Management System

Frontend-only React admin dashboard for a dairy shop. No backend/API — all data
is dummy data in `src/data/dummyData.js`.

## Tech Stack
- React.js + React Router
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no config file needed)
- Recharts (Sales Overview line chart, Weekly Sales bar chart)
- Framer Motion (sidebar, cards, modals animation)
- React Icons

## Setup

```bash
npm install
npm run dev
```

Terminal mein jo link show hoga (usually http://localhost:5173), wo browser mein khol lo.

Production build ke liye:

```bash
npm run build
npm run preview
```

## What's included
- Right-side collapsible sidebar — icons, active highlight, mobile hamburger menu
- Top navbar — page title, search box, notification icon, user profile, sidebar toggle
- Dashboard — 4 summary cards, Sales Overview line chart, Weekly Sales bar chart, Recent Sales table, Quick Actions
- Products page — search, category filter, Add/Edit modal, Delete confirmation modal, responsive table, pagination, empty state
- Sales / Stock / Customers / Reports / Settings — placeholder pages already wired into routing + sidebar

## Project structure

```
src/
  components/   Sidebar, Navbar, Layout, SummaryCard, Charts, tables, modals
  data/         dummyData.js — all mock data lives here
  pages/        Dashboard, Products, ComingSoonPage (used by remaining menu items)
  App.jsx       Routes
  main.jsx      Entry point
  index.css     Tailwind v4 import + theme tokens (colors, fonts, shadows)
```

No `tailwind.config.js` or `postcss.config.js` needed — Tailwind v4 works
directly through the Vite plugin in `vite.config.js`, and all custom design
tokens (colors, fonts, shadows, radius) live inside `@theme { ... }` at the
top of `src/index.css`.
