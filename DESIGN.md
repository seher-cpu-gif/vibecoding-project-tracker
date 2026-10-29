# Vibecoding Project Tracker — Design

---

## 1. Mood / vibe

Warm colours, good for late night coding+ day. easy to navigate and use.

`<TODO>`

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- `Linears issue board, minimal ![alt text](image-1.png)`
- `Warm colours, spaced apropriately`

Anti-references — what we are explicitly **not** trying to look like:

- `Cluttered, dense or anything with too much glare`

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#2B2D42` | `bg-brand-primary` | Header, "+" button, focus rings |
| `brand-accent` | `#5C6B8A` | `text-brand-accent` | Hover states, links |
| `surface-page` | `#F5F1EA` | `bg-surface-page` | Page background |
| `surface-card` | `#FFFCF7` | `bg-surface-card` | Card background |
| `text-primary` | `#1F2030` | `text-ink` | Body text |
| `text-muted` | `#6B6B7B` | `text-ink-muted` | Captions, dates, counts |


### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#7C3AED` (violet) | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `#BE185D` (deep pink) | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#15803D` (green) | +24 hours away |
| `due-warning` | `#B45309` (amber) | < 24 hours |
| `due-overdue` | `#B91C1C` (red) | Past due |
| `due-neutral` | `#78716C` (stone grey) | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Space Grotesk | Geometric, fits vibe-coding. |
| Body | Inter | Designed for screens; stays readable at small sizes. |
| Monospace (tags, badges, code) | JetBrains Mono | Familiar to developers. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

- **Cards:** `<Warm off-white on a cream page>`
- **Buttons:** `<Solid brand fill for the main action, outlined for secondary actions>` 
- **Modal:** `<Centred, medium width, dimmed backdrop>` 
- **Empty states:** `<Dashed border, muted text>` 
- **Drag affordance (if used):** `<Status dropdown first>` 

## 5. Voice / microcopy

| Where | Text |
|---|---|
| "+" button label | "+ New task" |
| Empty column placeholder | "Nothing here yet" |
| Toast after "Copy Context" | "Context copied. Paste it into your AI and pick up where you left off." |
| Confirm-delete message | "Delete this task?" |
| Handoff toast (M7) | "Handed off to {name}." |


## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `Glow` (match PRD §11 team identity)
- **Wordmark style:** `The name in Space Grotesk, semibold, brand-primary colour,` 

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
