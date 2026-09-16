# Handoff: Property Group — Intranet (SharePoint / SPFx)

## Overview
Interactive HTML prototype of a corporate intranet for Property Group (holding: RynekPierwotny.pl, GetHome, EstiCRM, voxDeveloper, Platforma Mieszkaniowa, BIG DATA, Akademia RE, GetHome Finance). Target platform is **SharePoint Online, implemented as SPFx web parts / an SPFx-based page**. Two screens were the initial focus (Start, Benefity) and the prototype has since grown to cover the full navigation.

## About the Design Files
The bundled file (`Intranet Property Group.dc.html`) is a **design reference / clickable prototype**, built in a proprietary browser-only template+React runtime used only inside this design tool. **It is not production code and cannot be deployed to SharePoint as-is.** Treat it as a very detailed, interactive spec: every screen, copy string, state transition, and piece of business logic in it is real and intentional, but the markup/JS itself must be **rebuilt from scratch as SPFx web parts** (React + Fluent UI, per Microsoft's SPFx toolchain), consuming real SharePoint lists / Graph API instead of the hardcoded arrays used here.

Open the HTML file directly in a browser to click through it — that's the fastest way to understand a screen before rebuilding it.

## Fidelity
**High-fidelity.** Colors, type, spacing, copy (Polish, verbatim where the client supplied text) and interaction states are final/intentional, not placeholders. A few items are explicitly marked TBD below (real photos, some phone numbers/links) — search the file for `image-slot` placeholders and `stub(` calls, which mark not-yet-real actions.

## Critical business rule — do not simplify
**Content-access gradation is the core UX pattern of this intranet and is a business decision, not a visual one.** Three access levels: **Wszyscy (All) / Menadżerowie (Managers) / Zarząd (Board)**. Content the current user's role can't access **must stay visible** — rendered as a dimmed/grayscale card with a "Brak dostępu" (No access) badge — and **must never be hidden or filtered out**. Clicking a locked card opens an explanation modal (why it's locked + who to contact), never a silent no-op. This pattern repeats on: Benefity (per-tier benefit cards), the global search results, and anywhere else role-gated content appears. Any reimplementation that hides locked items instead of dimming them is a regression, not a simplification.

## Screens / Views

### Global shell (present on every screen)
- **Sidebar** (fixed left, 264px, `#4D1A63` background) — logo, live search (see below), nav tree, user card (avatar initials + name + role) at the bottom. This is a fixed sidebar by deliberate decision (many sections) — never collapse it into a top-nav or dropdown.
- **Search** — a real, indexed client-side search (not a placeholder) covering pages, benefits, news, docs, people, and office places. Must be reimplemented against real data sources (SharePoint search API / Graph). Behavior to preserve: diacritic-insensitive matching (typing "zarzad" must find "Zarząd"), keyboard nav (↑↓/Enter/Esc), `⌘K` / `/` shortcut, highlighted match substring, and locked results shown with the same "Brak dostępu" badge (not filtered out).
- **Header** — breadcrumb, a "Podgląd jako" (Preview as) role switcher (**prototype-only** — in production the role comes from the logged-in user's real group membership, this control should not ship), notification bell (stub), dark-mode toggle (stub of a real theme, CSS-filter based here — do a real theming pass in production).
- **Nav tree**: Start · O firmie (Zarząd, Struktura, Departamenty i kontakty, Spółki grupy, Historia) · Misja i wartości · Dane rynkowe · Komunikacja i marka (Aktualności, Kalendarz, Social Media, Komunikacja wewnętrzna, Materiały graficzne, Kluby zainteresowań) · Dla pracownika (Oferty pracy, Benefity, Mapa biura, Biuro, Dokumenty i kontakt HR) · Pomoc techniczna i linki · Pliki i formularze · Twoja przestrzeń. Groups expand/collapse; a "Zwiń menu" (collapse all) control appears once any group is open.

### Start (home)
- Hero band (tinted `#F9EDFF` panel): greeting personalized to the logged-in user's first name (Graph `me` call in production), date, quick-action buttons (Wniosek urlopowy, Help Desk, …).
- Group stats + brand strip (8 portfolio companies as logo tiles, linking to Spółki grupy).
- Two-column body: **Aktualności** feed (left, top-3 posts; "priority" posts get a larger hero treatment with category badge + read-time; regular posts sit in a lighter feed list below) with reactions (3 fixed reaction types) + flat (non-threaded) comments; **sidebar** (right) with Nadchodzące wydarzenia (events, "Add to Outlook"/.ics), Nowi w zespole (newcomers, empty-state aware), Twoje skróty (quick links), a live weather widget, and **Twoja giełda** — a private, per-browser stock ticker watchlist (TradingView mini-widget embeds, symbols persisted to `localStorage`, not shared with other users — in production this should be a per-user preference, e.g. stored via Graph `me/insights` or a small user-settings list).
- A "Benefity" teaser section reusing the same locked/unlocked card treatment as the Benefity page.

### Benefity (the access-gradation reference screen)
- Header explains the transparency policy in plain language (we show every tier so the growth path is visible; locked tiers stay dimmed, not hidden).
- Tiers: **Wszyscy** and **Menadżerowie** (Board tier was removed — Property Group has no board-specific benefit package). Each tier section shows a "Masz dostęp" or "Brak dostępu" pill.
- Benefit cards: unlocked cards are fully interactive → open a detail modal (description, funding table where relevant, step-by-step "how to use", CTA, owner contact). Locked cards: same size/grid position, `grayscale(1)` + reduced opacity (+ optional blur, toggleable), "Brak dostępu" badge, click opens an explanation modal (which tier it needs + link to HR) instead of the detail modal.
- Real benefit data included: LUX MED (with full pricing table), MultiSport, training budget, glasses reimbursement, group insurance, lunch card, extended family medical, company car/allowance, executive coaching, conference budget — treat these as real content to preserve, not sample data.

### Mapa biura (Office map)
- Full office floor plan image (`assets/mapa-biura.png`) with click-to-zoom lightbox + download.
- "Streets" legend (4 color-coded zones: ul. Cybernetyki, Plac Centralny, Targowa, Finansowa) matching the floor plan's own zone coloring.
- A searchable/filterable list of ~47 real places (meeting rooms with capacity, team zones, amenities) below the map — each result deep-links from global search too.
- **Known UX note**: the map is a static image; a follow-up improvement (raised during review) is to add clickable hotspots directly on the image and/or a lighter "find a desk/room" widget elsewhere, keeping the full zoomable map on this dedicated page.

### O firmie (Company) group
- **Zarząd**: 5 board member cards (photo slot + name + role), click opens the org-tree modal (see below).
- **Struktura**: department list grouped by division (Dyrektor Generalny / Sprzedaż i Marketing pions), each with head + headcount, click-through to the filtered staff directory.
- **Departamenty i kontakty**: full staff directory, search + department filter dropdown, alphabetically sorted, click a person → org-tree modal.
- **Spółki grupy**: the 8 portfolio brands (RynekPierwotny.pl, GetHome, EstiCRM, voxDeveloper, Platforma Mieszkaniowa, BIG DATA, Akademia RE, GetHome Finance) as detail cards.
- **Historia**: timeline/stats of company growth 2009→2026, including office address history (culminating in the current ul. Rodziny Hiszpańskich 8 address, since May 2026).
- **Org-tree modal** (Teams-style person card): avatar + presence dot, quick actions row (chat/org-chart/video/call/LinkedIn — all stubs pointing at Teams equivalents in production), "Przełożony" (manager) card, and an expandable breadcrumb tree Zarząd → Pion → Dział → Zespół — every chip in that tree is clickable and deep-links to the matching filtered view. Opens **pre-expanded** when reached from a manager's own card.

### Misja i wartości
Mission statement + the six core values (Sprawczość, Relacje, Autentyczność, Fascynacja, Zespół, Jakość) as verbatim client copy — do not rewrite this text.

### Dane rynkowe (BIG DATA)
Marketing/product page for the BIG DATA analytics platform: stats, team photo banner, product cards (Monitoring, Raporty dedykowane, Raport kwartalny, dane surowe, Insight newsletter, cennik/FAQ), a small "latest publications" list linking to real bigdata.rynekpierwotny.pl articles, and contact cards. This is intentionally styled with a secondary/darker card treatment to visually separate it from the rest of the intranet (it's a sales-facing product, not an HR page) — a candidate for moving under "O firmie → Spółki grupy" in a future IA pass (flagged, not yet decided).

### Komunikacja i marka group
- **Aktualności**: full news list (same card as the Start feed, with priority/feed split, reactions + comments).
- **Kalendarz**: company events list + an Outlook "my calendar" preview block (**intentionally not wired to real data** in the prototype — in production, use Microsoft Graph `Calendars.Read` and the Graph Toolkit `mgt-agenda` component to show the logged-in user's real upcoming events without a custom backend).
- **Social Media**: portfolio brand social links + a real YouTube channel embed (latest video + 3 previous, thumbnails).
- **Komunikacja wewnętrzna**: the internal comms-approval policy (materials going external require Brand/DMiK approval via the Brand Approval Tool) — verbatim policy text, do not rewrite.
- **Materiały graficzne**: brand assets/downloads (logos, templates, brand book).
- **Kluby zainteresowań**: employee interest groups (climbing, football, running, book club, board games) — each "Dołącz na Teams" button is a stub for a real Teams deep link.

### Dla pracownika group
- **Oferty pracy**: real open roles sourced from propertygroup.pl/pracuj-z-nami (dated, with a referral-bonus callout).
- **Benefity**: see above.
- **Mapa biura**: see above.
- **Biuro**: office address/legal details, office team (Head of Office + 2 staff, with photo slots), practical info list (reception/guest cards, bike storage, etc.).
- **Dokumenty i kontakt HR**: enova self-service portal links (3 separate logins — one per legal entity: Property Group, EstiCRM, Platforma Mieszkaniowa), HR forms, GDPR/legal document library grouped by topic.

### Pomoc techniczna i linki (Help Desk)
- Self-service KB deflection: a search box over an "IT ticket" flow — typing a problem (e.g. "nie działa VPN") surfaces matching knowledge-base articles inline; only after no article helps does the flow point at filing a ticket. **Preserve this deflection-first order** — it exists specifically to reduce ticket volume, per stakeholder request.
- Ticket categories are organized by **user intent**, not by department: "Potrzebuję sprzętu", "Zgłaszam awarię", "Sprawy kadrowe i urlopy" (which correctly redirects to HR/Benefity pages rather than opening an IT ticket).
- enova portal links (again, 3 per-company logins) and a general "useful links" list (Brand Approval Tool, map, BIG DATA, calendar).

### Pliki i formularze
Flat list of common forms (leave request, benefit request, expense report, equipment request, etc.) plus two grouped document libraries: **RODO i ochrona danych osobowych** (7 real legal/GDPR documents) and a second compliance group — these link out to real SharePoint document URLs supplied by the client; preserve the URLs and groupings exactly.

### Twoja przestrzeń (Your space)
A private, per-user utility page — currently hosts the "Twoja giełda" stock-watchlist widget (see Start page notes). Everything here is scoped to the individual, never shared/visible to other employees.

## Interactions & Behavior
- **Role switching** ("Podgląd jako") instantly re-evaluates every locked/unlocked card and search result across the whole app — this is the mechanism to test the access-gradation pattern; remove this control in production and drive role from real group membership instead.
- **Modals**: benefit detail, access-denied explanation, org-tree, office-map zoom — all share the same overlay/close pattern (click backdrop or × to close, `Esc` closes whichever is open).
- **Reactions**: exactly 3 fixed types (Przydatne / Lubię to / Gratulacje), one active reaction per user per post, toggled by re-click. Deliberately not an open emoji picker (kept cheap to build/moderate).
- **Comments**: flat list, no threading, no @mentions, no notification fan-out — deliberately minimal to keep SPFx implementation cost low. If SharePoint list comments or Viva Engage are available in the target tenant, prefer wiring to those over building custom storage.
- **Browser back/forward**: in-app navigation pushes history state so back/forward moves between visited screens rather than always returning to Start.
- **Dark mode**: prototype approximates it with a CSS filter on the main content only (sidebar stays brand purple) — implement as a real color-token theme swap in production, not a filter.
- **Weather widget**: geolocation-based, degrades to a fixed-city fallback with a visible error state if location/network fails.

## State Management
State that needs a real backing store in production (all currently in-memory/localStorage in the prototype):
- Current user identity, role/group membership, display name (drives greeting + role gating) → Graph `me` + SharePoint group membership.
- News reactions + comments, per post → SharePoint list (or Viva Engage if available).
- "Welcomed" newcomers, read/unread state → SharePoint list or Graph.
- Personal stock watchlist symbols → per-user storage (Graph `me/insights`-style, or a small "user settings" list), **not** shared across users.
- Search index → SharePoint Search / Microsoft Search API rather than a hardcoded in-memory array.
- Outlook "my calendar" block → Graph `Calendars.Read` (see Kalendarz notes above).

## Design Tokens

**Color** — B2B-toned palette; **Dark Violet is primary, not Main Violet** (a deliberate choice, keep this hierarchy):
| Token | Hex | Use |
|---|---|---|
| Primary / Dark Violet | `#4D1A63` | sidebar, headings, primary buttons, dark card fills |
| Accent / Main Violet | `#A01BD7` | links, secondary CTAs, active states — never the dominant color |
| Accent tint (mid) | `#C764F0` | small accents, hover borders on locked cards |
| Accent tint (light) | `#E4A3FF` | avatars, decorative fills |
| Surface tint | `#F1D1FF` | icon chip backgrounds |
| Panel tint | `#F9EDFF` | section/hero panel backgrounds |
| Neutral panel | `#F5F1F8` | comment bubbles, muted chips |
| Border | `#E3DCE9` | all hairline borders |
| Text secondary | `#6E6178` | secondary/meta text — replaces a former `gray-400` that failed WCAG AA (2.58:1); this token is ~5.6:1 on white. **Do not reintroduce a lighter gray for any text or link.** |
| Text primary | `#2E2136` | body text, toast background |
| Signal / highlight | `#EBFF00` | search match highlight, focus rings, numbered-step badges — used sparingly |
| Background | `#FFFFFF` | page background |

**Typography**: `Plus Jakarta Sans` (weights 500–800) for headings, nav, labels, buttons; `DM Sans` (400–700) for body copy. Load both via Google Fonts in production or self-host per IT's SharePoint font policy.

**Radii**: 10–12px small controls/chips, 16–18px cards, 22px hero panels, full pill (`999px`) for badges/tabs.

**Shadows**: soft, colored-tint shadows on hover (`rgba(77,26,99, .08–.16)`), not neutral black shadows — keep this brand-tinted shadow approach.

**Spacing**: 8px base rhythm (gaps of 8/10/12/16/18/20px), page content max-width 1200–1260px, sidebar fixed at 264px.

## Assets
- `assets/logo-property-group.png` — sidebar logo (real asset).
- `assets/mapa-biura.png` — real office floor plan, client-supplied.
- `assets/news-golota.png`, `assets/news-vox.png` — real photos cropped from client-supplied press material.
- All other imagery in the prototype is an **`image-slot` placeholder** (drag-and-drop target in the design tool) — these are marked clearly in the source and must be replaced with real photography (team photos, board portraits, office/reception photo, brand banner) before ship.
- Icons are hand-drawn inline SVG (no icon font/library dependency) — fine to keep or swap for Fluent UI icons for SPFx consistency.

## Files
- `Intranet Property Group.dc.html` — the full interactive prototype (all screens, all logic, all copy described above). Open directly in a browser to click through it.
- `assets/` — the real image assets listed above.

This README is meant to be self-sufficient: a developer who wasn't part of the original design conversation should be able to plan and build the SPFx implementation from this document plus the linked prototype file, without needing further context.
