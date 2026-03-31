# Artisan Stall Manager

Artisan Stall Manager is now a pure static React + Vite SPA.
All data is stored locally in the browser using IndexedDB.

## Local Development

Requirements:
- Node.js 20+
- npm

Commands:
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173`

Build and local preview:
1. `npm run build`
2. `npm run preview`

## Deploy on Coolify

This project should be deployed as a **Static Site** in Coolify.
No backend runtime, database, or server process is required.

### Recommended Coolify Settings

- Build pack: `Nixpacks` (static frontend)
- Install command: `npm install`
- Build command: `npm run build`
- Start command: not required (static deployment)
- Port: not required (static deployment)
- Publish directory: `dist`

### Notes

- The app is client-side only.
- Persistence is browser-local (IndexedDB), scoped by origin/domain.
- Changing domain does not automatically move existing user data.

## Migrating Browser Data from Old Replit Domain

Because IndexedDB is origin-scoped, data from the old Replit domain will not appear automatically on the new VPS domain.

Use this migration flow:
1. Open the app on the old Replit domain.
2. Go to `Impostazioni`.
3. Click `Esporta Backup JSON`.
4. Open the app on the new Coolify domain.
5. Go to `Impostazioni`.
6. Click `Importa Backup JSON` and select the exported file.

The JSON backup/restore preserves:
- products
- sold/created counters
- images
- categories

The existing CSV import/export flow is still available and unchanged for operational use.
