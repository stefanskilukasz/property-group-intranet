# Architektura techniczna

## Stos technologiczny

- **SharePoint Communication Site** jako strona główna intranetu.
- **SPFx (SharePoint Framework)** — React + TypeScript dla customowych webpartów.
- **Microsoft 365 Groups** — zarządzanie poziomami dostępu / rolami.
- **Microsoft Graph API** — sprawdzanie przynależności do grup z poziomu
  webpartu (`/me/memberOf`).
- **PnP PowerShell** — automatyzacja tworzenia list, grup, uprawnień
  (zamiast ręcznego klikania w UI SharePoint).

## Struktura contentu

| Element              | Realizacja                                         |
|----------------------|-----------------------------------------------------|
| Aktualności          | Natywny webpart "News" (Site Pages)                 |
| Kalendarz wydarzeń   | Natywny webpart "Events" (lista typu Calendar)       |
| Szybkie linki        | Natywny webpart "Quick Links"                        |
| Benefity (gradacja)  | **Custom SPFx webpart** — patrz `benefits-access-gradation.md` |
| Branding / theme     | `Add-PnPTheme` + `Set-PnPWebTheme` (PnP PowerShell)  |

## Dlaczego benefity wymagają custom kodu

Natywne webparty SharePoint nie potrafią warunkowo renderować treści na
podstawie przynależności użytkownika do grupy Microsoft 365. Stąd potrzebny
jest webpart SPFx, który:

1. Pobiera listę benefitów z listy SharePoint (`Benefity`), z kolumną
   `PoziomDostepu` (Choice: Wszyscy / Menadzerowie / Zarzad).
2. Woła Microsoft Graph (`/me/memberOf`), żeby ustalić, do jakich grup
   należy zalogowany użytkownik.
3. Filtruje i renderuje karty benefitów odpowiednio do poziomu.

**Ważne:** filtrowanie w UI to warstwa kosmetyczna. Realne zabezpieczenie
musi istnieć na poziomie SharePoint (item-level permissions albo osobne
listy per poziom z break-inheritance), żeby ktoś nie zobaczył danych przez
REST API, eksport do Excela czy Power Automate.

## Ścieżka wdrożenia webpartu

```bash
yo @microsoft/sharepoint
gulp bundle --ship
gulp package-solution --ship
# wgraj wygenerowany .sppkg do App Catalog
# dodaj webpart na stronie przez edytor SharePoint
```
