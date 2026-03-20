# Design System — Koliesko Country Klub

## Color Palette (HSL CSS Variables)

### Core
| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | 225 22% 7% | Page background |
| `--foreground` | 42 25% 93% | Primary text |
| `--card` | 225 20% 11% | Card backgrounds |
| `--primary` / `--gold` | 40 82% 52% | Primary actions, gold accents |
| `--secondary` | 225 18% 15% | Secondary surfaces |
| `--muted` | 225 16% 14% | Muted backgrounds |
| `--muted-foreground` | 225 12% 50% | Secondary text |
| `--border` | 225 16% 18% | Borders |
| `--destructive` | 0 72% 51% | Errors, cancellations |
| `--success` | 152 56% 42% | Confirmations |

### Gold Scale
| Token | HSL | Usage |
|-------|-----|-------|
| `--gold` | 40 82% 52% | Primary gold |
| `--gold-light` | 40 65% 68% | Light gold accents |
| `--gold-dark` | 40 85% 38% | Dark gold emphasis |

## Typography
- **Display (headings):** `'Recoleta', Georgia, serif`
- **Body:** `'General Sans', system-ui, sans-serif`
- **Headings:** `text-wrap: balance`, negative tracking on display type
- **Body text:** `text-wrap: pretty`, `overflow-wrap: break-word`
- **Data/prices:** `tabular-nums`
- **Labels:** uppercase, tracking-[0.15em], text-[11px], font-semibold

## Spacing Scale
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px (Tailwind defaults)

### Section Padding
- Standard sections: `py-28` (112px)
- Section gaps vary for rhythm — never two consecutive at same padding
- Container: `max-w-3xl` to `max-w-5xl` depending on content

## Border Radius
- `--radius: 0.875rem` (14px)
- Cards/dialogs: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Small badges: `rounded-full`
- Concentric radius rule: outer = inner + padding

## Shadows
| Name | Usage |
|------|-------|
| `shadow-premium` | Standard card elevation |
| `shadow-premium-lg` | Featured cards, dialogs |
| `shadow-card-hover` | Card hover state |
| `shadow-inner-glow` | Subtle inner highlight |

## Section Layout Behavior
- Each section has a decorative gold divider line at top: `w-px h-16 bg-gradient-to-b from-transparent via-gold/15 to-transparent`
- Sections alternate between `bg-background` and `bg-card`
- All sections must have scroll-reveal animations (reveal-up, reveal-left, reveal-scale)

## Homepage Composition
1. Hero (sketch background + parallax)
2. Daily menu preview (tabbed by day)
3. Atmosphere/story (sketch + text, 2-column)
4. Events CTA (3 feature cards + action)
5. E-shop teaser (centered card)
6. Contact + map
7. Footer

## Card Rules
- Background: `bg-card`
- Border: `border border-border`
- Hover: `hover:border-gold/20`
- Shadow: `shadow-premium` or `shadow-premium-lg`
- Internal padding: `p-6` or `p-8`
- Group hover on icon containers: `group-hover:bg-gold/15`

## Logo Usage
- Navbar: `h-14 md:h-16`
- Footer: `h-14`
- Login: `h-16` centered
- Admin header: `h-8`
- Always use `logo-koliesko-gold.png` (golden version)

## Sketch Usage
- Hero: full-width background with parallax + dark overlay
- O nás page: featured image in 2-column layout
- Atmosphere section: left column with rounded corners + border

## Food Asset Usage
- Featured dish cards with premium spacing
- E-shop product cards
- Gallery items with hover zoom effect

## Interaction Rules
- Buttons: `active:scale-[0.97]` on all interactives
- Links: `hover:text-gold transition-colors duration-200`
- Cards: `hover:border-gold/20 transition-all duration-300`
- Gold glow on hover: `.glow-gold-hover`
- Form focus: `focus:ring-2 focus:ring-ring`
