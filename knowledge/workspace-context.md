# Workspace Context — AI/Developer Working Memory

## Continuity Assumptions
- This is an iterative project — each session builds on prior work
- The dark premium theme with gold accents (#D4A24C) is the established visual identity
- Typography: Recoleta (display) + General Sans (body) — do not change
- Logo: Golden version on transparent background — do not regenerate
- Sketch asset (koliesko-skica.jpeg) is a signature brand visual

## What Must Be Preserved
- **Authentication system** — useAuth hook with Supabase, role-based admin access
- **Database schema** — events, reservations, profiles, user_roles tables with RLS
- **Peťko assistant** — AI chat + ElevenLabs TTS, custom avatar
- **Edge functions** — petko-chat (Lovable AI), petko-tts (ElevenLabs)
- **Menu data model** — allergens, weights, prices, tags structure
- **Reservation flow** — calendar → dialog → Supabase insert → admin approval
- **Design tokens** — CSS variables in index.css, tailwind config extensions

## What Is Being Refined
- Homepage composition — now includes atmosphere, events CTA, e-shop teaser sections
- Navigation — expanded to include all public routes
- Route structure — added /denne-menu, /menu, /o-nas, /galeria pages
- Content — Slovak hospitality tone throughout

## Priorities for Future Sessions
1. **MENUMAT integration** — build import/preview/publish pipeline in admin
2. **Admin expansion** — sub-routes for daily-menu, menu, products, orders, media, settings
3. **E-shop enhancement** — Supabase-backed orders, payment readiness
4. **Gallery** — real photo upload and management
5. **SEO** — meta tags, structured data, sitemap
6. **Performance** — image optimization, lazy loading

## Architectural Direction
- React + Vite + Tailwind + TypeScript (no changes)
- Supabase (Lovable Cloud) for all backend
- Edge functions for AI and TTS
- Component-based, modular sections
- Semantic HTML, accessibility basics

## UI/UX Intent
- Hospitality-first, not dashboard-first
- Warm, inviting, premium feel
- Clear hierarchy: hero → content → CTA
- Mobile-responsive with scroll reveal animations
- Consistent card styling with border + shadow system

## Brand Asset Importance
- **Logo** (logo-koliesko-gold.png): header, footer, login, admin, favicon area
- **Sketch** (koliesko-skica.jpeg): hero background, about page, atmosphere section
- **Peťko avatar** (petko-avatar.png): chat widget, greeting tooltip

## ⚠️ Warnings
- Do NOT revert to generic SaaS dark themes
- Do NOT replace Recoleta/General Sans fonts
- Do NOT remove gold accent system
- Do NOT break existing Supabase RLS policies
- Do NOT modify auto-generated files (client.ts, types.ts, .env)
- Do NOT use generic placeholder names (John Doe, etc.)
- Do NOT add glassmorphism, neon glows, or gradient orbs
