# Artisan Stall Manager

## Overview

A Progressive Web App (PWA) for managing artisan market stall inventory. The app enables stallholders to track handmade products (necklaces, bracelets, rings, etc.), record sales, log new creations, and export daily reports. Designed to work fully offline after initial load using service workers and IndexedDB for local data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for Replit environment
- **Styling**: Tailwind CSS with custom design tokens for consistent UI
- **Component Library**: shadcn/ui (Radix UI primitives with custom styling)
- **State Management**: React useState/useEffect with local persistence via IndexedDB

### PWA Implementation
- **Service Worker**: Custom service worker (`client/public/service-worker.js`) handles caching for offline functionality
- **Manifest**: Web app manifest enables installation on mobile devices
- **Offline Storage**: IndexedDB stores products and metadata locally, enabling full offline operation

### Data Layer
- **Local Storage**: IndexedDB (`client/src/lib/indexeddb.ts`) provides persistent client-side storage
- **Schema**: Zod schemas (`shared/schema.ts`) define and validate data structures
- **Import/Export**: CSV/TXT file parsing for product import, CSV export for daily reports

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but app primarily runs offline)
- **API Pattern**: RESTful routes under `/api` prefix
- **Static Serving**: Production build served via Express static middleware

### Application Flow
1. **Home Screen**: Two entry points - Import Database or Manual Entry
2. **Import Wizard**: Upload CSV/TXT files with product data
3. **Manual Entry**: Step-by-step form for adding products individually
4. **Sales Screen**: Track sales and new creations with +/- counters, export functionality

### Key Design Decisions
- **Offline-First**: Core functionality works without network connection
- **Touch-Friendly**: Large touch targets and mobile-responsive layout
- **Italian UI**: Interface text in Italian for target market
- **Data Safety**: Warns users before leaving with unexported data

## External Dependencies

### UI Components
- Radix UI primitives (dialog, select, tabs, toast, etc.)
- Lucide React for icons
- Class Variance Authority for component variants
- Embla Carousel for carousel functionality

### Data & Forms
- Zod for schema validation
- React Hook Form with Zod resolver
- TanStack Query for async state management

### Database
- PostgreSQL (via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- Drizzle Kit for migrations

### Build & Development
- Vite for frontend bundling
- esbuild for server bundling
- TypeScript for type safety
- Replit-specific plugins for development experience