# Koliesko Country Klub — Project Overview

## Purpose
Premium restaurant website for **Koliesko Country Klub** — a family restaurant in Bratislava-Trnávka (Banšelova 3) operating since 2004. The site serves as the public-facing brand presence, daily menu publisher, reservation system, event inquiry platform, and online ordering channel.

## Brand Summary
- **Tone:** Warm, elegant, premium, rustic-modern country club
- **Cuisine:** Traditional Slovak and Czech cuisine
- **Location:** Bratislava – Ružinov/Trnávka
- **Capacity:** Up to 120 guests (indoor + terrace + garden)
- **Price point:** Daily menu from 6.90€, events ~40€/person

## Public Routes
| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, daily menu preview, atmosphere, events CTA, e-shop teaser, contact |
| `/denne-menu` | Full daily menu page (Mon–Fri) |
| `/menu` | Permanent à la carte menu |
| `/o-nas` | About us — story, values, sketch visual |
| `/galeria` | Photo gallery |
| `/akcie` | Events & celebrations with price calculator |
| `/eshop` | Online ordering from daily menu |
| `/rezervacia` | Reservation with calendar and calculator |
| `/kontakt` | Contact form, map, opening hours |

## Admin Routes
| Route | Purpose |
|-------|---------|
| `/login` | Admin authentication |
| `/admin` | Admin panel — events & reservations management |

## Key Modules
- **Daily Menu** — Weekly menu data with allergens, weights, prices, tags
- **Event Calendar** — Supabase-backed calendar showing availability
- **Reservation System** — Form → Supabase with admin approval workflow
- **E-shop** — Cart-based ordering from daily menu items
- **Peťo Assistant** — AI chatbot + ElevenLabs TTS + browser STT voice guide

## MENUMAT / MenuMaestro Connection
- Currently uses static `menuData.ts` as data source
- Prepared for API/JSON/CSV import from MENUMAT
- Normalized model supports: date, category, item, price, allergens, tags, featured flags
- Future: receive → validate → preview → edit → publish flow

## Ordering Model
- E-shop uses daily menu items with cart functionality
- Orders sent via mailto link (extensible to Supabase-backed orders)
- Delivery zone: Ružinov–Trnávka (10:00–12:00)
- Outside zone: ClickFood.sk partner

## Reservation Model
- Supabase `reservations` table with RLS
- Public insert (validated), admin-only read/update/delete
- Status flow: pending → confirmed / cancelled

## Events Flow
- Supabase `events` table
- Admin creates events (confirmed/tentative, public/private)
- Public calendar shows availability
- Click on free day → reservation dialog

## Peťo Role
- AI chatbot powered by Lovable AI (Gemini 2.5 Flash)
- ElevenLabs TTS for Slovak voice
- Browser Web Speech API for voice input (sk-SK)
- Auto voice greeting on first page load
- Page-aware context
- Quick action choices
- First-visit greeting
- Custom avatar from real photo

## Project Boundaries — What This Is NOT
- NOT a SaaS dashboard or admin-heavy application
- NOT a menu generator (MENUMAT is external)
- NOT a restaurant ERP
- NOT a payment processing system (yet)
- NOT a multi-tenant platform
