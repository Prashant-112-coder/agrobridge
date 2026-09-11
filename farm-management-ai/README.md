# FarmOS AI

AI-assisted farm management workspace for the full plantation-to-harvest lifecycle.

- Private Supabase Auth + Postgres with RLS
- Farm and crop-cycle management
- Field diary for watering/irrigation, pesticide/insecticide, fertilizer, weeding, pruning, scouting and other work
- Date, product, quantity, unit, reason, cost and notes per activity
- Harvest, expense and task schema
- Dashboard, timeline and crop views
- Explainable Agro AI API based on recorded farm history
- Vercel-ready frontend and Render-ready API

## Setup
1. Run `supabase/schema.sql` in Supabase SQL Editor.
2. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_API_URL`.
3. `npm install && npm run build` for the frontend.
4. Render: `npm install` then `node server/index.js`.

Architecture: GitHub → Vercel + Render → Supabase.