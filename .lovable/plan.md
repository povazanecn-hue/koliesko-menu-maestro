

# Koliesko Country Klub — Master Build Plan

The uploaded LOVABLE-MASTER-PROMPT.md defines a 10-step implementation plan. Here is the current state analysis and execution plan.

## Current State vs Required

| Area | Status | Action |
|------|--------|--------|
| DB: events, reservations, profiles, user_roles | Exists | Keep |
| DB: daily_menus, menu_items | Missing | Create |
| DB: menu_card | Missing | Create |
| DB: orders, order_items | Missing | Create |
| DB: gallery | Missing | Create |
| DB: testimonials | Missing | Create |
| DB: contact_messages | Missing | Create |
| DailyMenu component | Static data (menuData.ts) | Migrate to Supabase |
| E-shop | Uses mailto | Migrate to Supabase orders |
| Gallery page | Placeholder only | Connect to Supabase gallery table |
| O nás page | Skeleton (71 lines) | Expand content |
| SEO meta tags | Missing | Add react-helmet-async |
| GDPR cookie consent | Missing | Add |
| Contact form | Uses mailto | Save to Supabase contact_messages |
| Admin panel | Events + Reservations only | Add Menu, Orders, Gallery tabs |
| Testimonials section | Missing | Add to homepage |
| Loading/skeleton states | Missing | Add to all Supabase queries |
| Empty states | Missing | Add |

## Implementation Steps (matching master prompt order)

### Step 1: Database Schema + Seed Data
Create 6 new tables via migration:
- `daily_menus` — date, day_of_week, is_published
- `menu_items` — daily_menu_id FK, category, name, description, weight, price, allergens, sort_order
- `menu_card` — permanent menu items with category, price, photo_url
- `orders` + `order_items` — customer info, delivery type, status workflow
- `gallery` — category, image_url, sort_order, is_visible
- `testimonials` — author, content, rating, source
- `contact_messages` — name, email, message, is_read

All with RLS policies (public read where applicable, authenticated full access for admin). Seed test data for daily menus (Mon-Fri with 4-6 items each), 10 menu_card items, 3 testimonials, 5 gallery placeholders.

### Step 2: DailyMenu Migration
- Rewrite `DailyMenuSection` and `DenneMenuPage` to fetch from Supabase `daily_menus` + `menu_items`
- Keep existing UI design (dark cards, gold accents, allergen badges)
- Add skeleton loading states and empty state fallback
- Auto-select current day tab

### Step 3: E-shop Overhaul
- Replace mailto with Supabase `orders` + `order_items` insert
- Add checkout form: name, phone, delivery type (pickup/delivery), address if delivery
- Order confirmation dialog with order number
- Cart persistence via localStorage

### Step 4: Gallery
- Connect to Supabase `gallery` table
- Filter tabs: Všetko | Interiér | Jedlá | Akcie | Terasa
- Lightbox dialog for fullscreen view
- Lazy loading images

### Step 5: O nás Expansion
- Expand with stats section (120 miest, 20+ rokov, 4.5★)
- Add 3 value cards (kvalita, tradícia, komunita)
- Team section placeholder

### Step 6: Testimonials Homepage Section
- New "Čo hovoria naši hostia" section on homepage
- 3 cards with quote, author, rating stars, source
- Gold border-left styling
- Data from Supabase `testimonials`

### Step 7: SEO
- Install `react-helmet-async`
- Add `<HelmetProvider>` in App.tsx
- Add `<Helmet>` with title, description, OG tags on every page
- JSON-LD Restaurant schema on homepage

### Step 8: Admin Panel Extension
- Add tabs: Dashboard (KPI cards), Menu (CRUD daily_menus + menu_items), Objednávky (orders with status management), Galéria (upload + manage)
- Keep existing Events and Reservations tabs

### Step 9: Small Fixes
- GDPR cookie consent banner
- Branded 404 page
- Contact form saves to `contact_messages` table
- Loading/skeleton states on all Supabase queries
- Empty states for empty lists

### Step 10: Contact Form
- Replace mailto with Supabase `contact_messages` insert
- Success toast after submission

## Technical Notes
- All new tables use RLS with public read + authenticated write
- No changes to `client.ts` or `types.ts` (auto-generated)
- Existing components (Navbar, Hero, Footer, PetkoAssistant) preserved
- Design system (dark + gold, Recoleta + General Sans) preserved
- All UI text in Slovak, code in English

