# MENUMAT / MenuMaestro Integration

## Overview
MENUMAT (MenuMaestro) is an external menu management system. Koliesko uses it for daily menu planning. This project builds the **receiving layer** — import, validate, preview, publish.

## Supported Import Modes
1. **API mode** — future direct REST/webhook integration
2. **JSON import** — structured JSON file upload in admin
3. **CSV import** — tabular CSV upload with column mapping
4. **Manual fallback** — direct entry in admin interface

Currently uses **manual fallback** via static `src/data/menuData.ts`.

## Expected Data Normalization
All imports normalize to this model:

```typescript
interface DailyMenuItem {
  date: string;               // ISO date
  source: 'menumat' | 'manual';
  category: 'soup' | 'main' | 'dessert' | 'salad';
  name: string;
  description?: string;
  price: number;              // EUR with VAT
  allergens: number[];        // EU 1-14
  tags?: string[];            // 'odporúčané', 'nové', 'so sebou'
  image?: string;             // URL or storage path
  weight?: string;            // "150/200/50 g"
  available: boolean;
  featuredOnHome: boolean;    // Show in homepage daily menu section
  visibleInEshop: boolean;    // Show in e-shop for ordering
  takeAway: boolean;          // Available for takeaway
  published: boolean;
  sortOrder: number;
}
```

## Publish Flow
1. **Receive** — Admin uploads JSON/CSV or edits manually
2. **Validate** — Check required fields, allergen numbers, price format
3. **Normalize** — Map to standard model
4. **Preview** — Show admin how menu will look on website
5. **Edit** — Allow corrections before publishing
6. **Publish** — Set `published: true`, update timestamp
7. **Render** — Menu appears on website immediately

## Homepage Propagation
Items with `featuredOnHome: true`:
- Appear in homepage DailyMenuSection
- Sorted by `sortOrder`
- Show price, allergens, weight, tags

## E-shop Propagation
Items with `visibleInEshop: true`:
- Appear in /eshop product listing
- Can be added to cart
- Show full details including extras

## Manual Fallback
When no MENUMAT data is available:
- Admin enters menu items directly
- Uses same normalized model
- Same preview/publish flow
- Source marked as 'manual'

## Admin Preview Before Publish
- Side-by-side view: "Ako to uvidia zákazníci"
- Toggle individual items' visibility flags
- Bulk publish/unpublish by day

## Technical Notes for Future API Replacement
- Data model is provider-agnostic
- Import logic should be in a dedicated edge function
- Admin UI triggers import → preview → publish
- Webhook endpoint for automated daily push from MENUMAT
- Fallback to last published menu if import fails
