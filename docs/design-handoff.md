# Handoff: Property Group — Intranet (SharePoint / SPFx)

## What this is
An interactive HTML prototype of a corporate intranet for Property Group (holding: RynekPierwotny.pl, GetHome, EstiCRM, voxDeveloper, Platforma Mieszkaniowa, BIG DATA, Akademia Real Estate, GetHome Finance). Target platform: **SharePoint Online via SPFx**.

**This file is a design reference, not deployable code.** It runs only inside the design tool's proprietary template+React runtime. Open `Intranet Property Group.dc.html` in a browser to click through every screen before rebuilding — treat it as a detailed, interactive spec: every screen, copy string, state transition and business rule in it is intentional. Rebuild as SPFx web parts (React + Fluent UI) against real SharePoint lists / Microsoft Graph, not by porting this markup.

## Fidelity
High-fidelity. Colors, type, spacing, and Polish copy are final, not placeholder — except explicit TBDs: `image-slot` elements (photo/logo placeholders, drag-and-drop in the design tool) and any `stub(...)` call (shows a "not in scope" toast — a deliberately unbuilt action).

## Critical business rule — content-access gradation
Three roles: **Wszyscy / Menadżerowie / Zarząd**. Content a role can't access **stays visible**, dimmed + "Brak dostępu" badge, never hidden. Click opens an explanation (why locked, who to ask), never a silent no-op. Applies to: Benefity cards, global search results, anywhere role-gated content appears. Do not hide locked items in the rebuild.

## Navigation (current IA)
Fixed left sidebar (264px, brand purple `#4D1A63`) — deliberate, not a top-nav:
- **Start** — home dashboard
- **O firmie**: Zarząd · Struktura · Departamenty i kontakty · Spółki grupy · Biuro · Historia
- **Misja i wartości**
- **Dane rynkowe** (BIG DATA product/sales page)
- **Komunikacja i marka**: Aktualności · Kalendarz · Social Media · Materiały graficzne
- **Kluby zainteresowań**
- **HR**: Oferty pracy · Benefity · Dokumenty i kontakt HR
- **Pomoc techniczna i linki**: Pomoc techniczna · Baza wiedzy
- **Ochrona danych osobowych** (RODO documents, standalone)
- **Baza procedur**: Polityka komunikacji zewnętrznej · Dokumenty prawne i korporacyjne
- **Pliki i formularze**
- **Twoja przestrzeń** (private, per-user — stock watchlist)

## Global shell
- **Search**: real client-side index (pages, benefits, news, docs, people, office places, KB articles) — diacritic-insensitive, `⌘K`/`/` shortcut, ↑↓/Enter/Esc, highlighted match, locked results keep the "Brak dostępu" badge instead of being filtered. Rebuild against SharePoint Search / Microsoft Search API.
- **Header**: breadcrumb, "Podgląd jako" role switcher (**prototype-only** — drop in production, derive role from real group membership), dark-mode toggle (CSS-filter based here; do a real token-swap theme in production).
- **Browser back/forward** navigates between visited in-app screens (history API), not just to Start.

## Screen notes

**Start**: personalized greeting (first name — Graph `me` in production) + date; quick actions; "Dziś" card (weekday/date, live weather via geolocation with fallback, days-to-next-public-holiday computed from a real Polish-holiday algorithm — skips weekend holidays); mini month calendar (click a day with an event → Kalendarz); "Twoje skróty" — user-editable, up to 5, persisted to `localStorage`, catalog includes enova (×3 companies), Zdalkus, Help Desk, Parkus, HR, mapa, materiały graficzne; "Marki i projekty grupy" brand strip; Aktualności feed (priority hero post + lighter list) with 3 fixed-type reactions + flat unthreaded comments; sidebar: Nadchodzące wydarzenia (auto-filtered to future events only, empty-state aware, "Dodaj do Outlooka"/.ics), Nowi w zespole (empty-state aware), Pogoda widget, "Twoja giełda" (private per-browser TradingView watchlist, `localStorage`-only — needs a real per-user store in production, e.g. Graph `me/insights`-style or a settings list).

**Benefity**: tiers **Wszyscy** and **Menadżerowie** (no board-specific tier — confirmed with client). Real content: LUX MED (full pricing table + add-ons), MultiSport, Unum (life insurance, all-tier). Unlocked cards open a detail modal (description, funding, step-by-step, real linked source documents); locked cards same size/position, dimmed + badge, click explains + links to HR.

**O firmie**: Zarząd = 5 board member cards (photo slot, click → org-tree modal). Struktura = department list by division, headcount, click-through to filtered directory. Departamenty i kontakty = full staff directory, search + department dropdown, grouped by department (collapsible — auto-expanded only when filtered/searched or ≤1 group), dept head listed first then alphabetical, photo slots. Spółki grupy = 8 portfolio brands as cards. Biuro = address/legal, office team (3 real people + photo slots), practical info, **and the office floor-plan/search widget (streets legend, zoomable map image, searchable list of ~47 real places)** — this used to be a separate "Mapa biura" page; it's now folded into Biuro only (don't resurrect a standalone map route). Historia = growth timeline 2009→2026 incl. real office-address history ending at ul. Rodziny Hiszpańskich 8 (current, since May 2026).

**Org-tree modal** (Teams-style person card): avatar+presence, quick-action row (chat/org-chart/video/call/LinkedIn-equivalent — stubs for real Teams integration), "Przełożony" card (real manager lookup), expandable Zarząd→Pion→Dział→Zespół breadcrumb — every chip is clickable and deep-links to the matching filtered view.

**Dane rynkowe (BIG DATA)**: product/sales page, deliberately styled with a secondary/darker card treatment to read as "not an HR page." Stats, team photo, varied-accent product cards, real linked publications, contact people, awards. A candidate for relocating under O firmie → Spółki grupy in a future IA pass (flagged, not decided).

**Komunikacja i marka**: Aktualności (full feed); Kalendarz (month-grid calgrid component + "Twój kalendarz" Outlook-preview block — **intentionally unwired**, no fake data; production should use Graph `Calendars.Read` + Graph Toolkit `mgt-agenda`); Social Media (8 brand cards w/ owner-contact org-tree links, channel icons, real YouTube embed — latest + 3 previous); Materiały graficzne (asset list + real Teams channel link for anything not yet catalogued).

**Kluby zainteresowań**: informal Teams-channel groups; only real channel links are linked — clubs without a confirmed link show plain unlinked text ("start your own Teams group"), never a placeholder button.

**HR**: enova portal links (3 logins — Property Group / EstiCRM / Platforma Mieszkaniowa), "Cele i premie" (goals/appraisal/bonus access) shown as a dashed **"coming November 2026"** placeholder — no fake preview data, HR content not yet supplied, real team contacts.

**Pomoc techniczna**: KB-deflection search (type a problem → matching articles appear before any ticket option) — preserve this order, it exists to cut ticket volume. Ticket categories organized by user intent, not department.

**Ochrona danych osobowych**: 7 real GDPR/legal documents with real SharePoint URLs, standalone from Pliki i formularze.

**Baza procedur**: Polityka komunikacji zewnętrznej (DMiK-001/2026 — real external-comms approval policy, verbatim, real contacts, Brand Approval Tool link); Dokumenty prawne i korporacyjne (NDA, power-of-attorney policy, corporate data — real URLs).

**Twoja przestrzeń**: private per-user utility page (currently the stock watchlist) — nothing here is shared across users.

## Interaction rules to preserve
- Role switch re-evaluates every locked/unlocked card + search result live. Remove in production; derive role from real group membership.
- All empty-link/dead-button issues found in review were fixed by either linking to a real destination or removing the affectation of interactivity (plain text/badge, no button chrome) — do not reintroduce fake CTAs. If a real destination doesn't exist yet, prefer an honest "not available yet" state over a stub toast.
- Meeting-room "reserve" actions: Ratusz & Biblioteka route to a real mailto (no booking system exists for those); all other rooms show plain (non-interactive) text pointing to Outlook room-resource booking — never a button with no real destination.
- Reactions: exactly 3 fixed types, one per user per post, re-click toggles.
- Comments: flat, no threads/mentions — prefer wiring to SharePoint list comments or Viva Engage if available over custom storage.

## Design tokens
| Token | Hex | Use |
|---|---|---|
| Primary / Dark Violet | `#4D1A63` | sidebar, headings, primary buttons |
| Accent / Main Violet | `#A01BD7` | links, secondary CTAs — never dominant |
| Accent mid | `#C764F0` | small accents |
| Accent light | `#E4A3FF` | avatars, decorative fills |
| Surface tint | `#F1D1FF` | icon chips |
| Panel tint | `#F9EDFF` | hero/section panels |
| Neutral panel | `#F5F1F8` | comment bubbles, muted chips |
| Border | `#E3DCE9` | hairlines |
| Text secondary | `#6E6178` | ~5.6:1 on white — do not reintroduce a lighter gray |
| Text primary | `#2E2136` | body copy |
| Signal | `#EBFF00` | search highlight, focus rings — sparingly |

Typography: `Plus Jakarta Sans` (500–800, headings/UI), `DM Sans` (400–700, body). Radii 10–18px (22px hero, pill badges). Soft brand-tinted shadows on hover, not neutral black.

## Assets
`assets/` — real: `logo-property-group.png`, `mapa-biura.png` (real floor plan), `news-golota.png`, `news-vox.png`, plus stock office photography (`office-*.jpg`) used as hero/banner imagery. Everything else in the prototype is an empty `image-slot` placeholder (team photos, portraits) — replace before ship.

## Files
- `Intranet Property Group.dc.html` — full prototype, open directly in a browser.
- `assets/` — real assets above.
- `image-slot.js` — the placeholder-image web component the prototype loads (reference only, not needed in the SPFx rebuild).

This README should be sufficient on its own, alongside the prototype file, for a developer with no prior context to plan and build the SPFx implementation.
