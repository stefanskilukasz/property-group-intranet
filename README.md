# Projekt SPFx (do zainicjalizowania)

Ten folder jest celowo pusty poza tym plikiem — projekt SPFx generuje się
przez oficjalny generator Yeoman, który tworzy pełną strukturę zależności
(node_modules, konfiguracje gulp/webpack, itd.). Nie ma sensu tego
ręcznie pisać/kopiować.

## Jak zainicjalizować (poproś o to Claude Code)

```bash
cd spfx
npm install -g yo @microsoft/generator-sharepoint
yo @microsoft/sharepoint
```

Podczas kreatora wybierz:
- **Solution name:** `property-group-intranet`
- **Target:** SharePoint Online only
- **Component type:** WebPart
- **Framework:** React

Następnie poproś Claude Code o zaimplementowanie webpartu benefitów
zgodnie z `../docs/benefits-access-gradation.md` i stylami z `../CLAUDE.md`.

## Build i wdrożenie

```bash
gulp bundle --ship
gulp package-solution --ship
# .sppkg pojawi się w sharepoint/solution/ — wgraj go do App Catalog
```
