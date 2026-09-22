/**
 * Navigation model, ported verbatim (ids, labels, grouping, order) from the
 * prototype's `NAV` array in design/Intranet Property Group.dc.html.
 *
 * Note: the prototype's internal state still has a leftover `mapa` route,
 * but it is NOT reachable from NAV — confirming docs/design-handoff.md's
 * statement that the standalone "Mapa biura" page was folded into `biuro`.
 * Do not add a `mapa` nav entry.
 */
export interface INavLeaf {
  id: string;
  label: string;
}

export interface INavItem extends INavLeaf {
  icon: string;
  children?: INavLeaf[];
}

export const NAV: INavItem[] = [
  { id: 'start', label: 'Start', icon: 'home' },
  {
    id: 'firma', label: 'O firmie', icon: 'building', children: [
      { id: 'schemat', label: 'Zarząd' },
      { id: 'struktura', label: 'Struktura' },
      { id: 'zespol', label: 'Departamenty i kontakty' },
      { id: 'spolki', label: 'Spółki grupy' },
      { id: 'biuro', label: 'Biuro' },
      { id: 'historia', label: 'Historia' }
    ]
  },
  { id: 'misja', label: 'Misja i wartości', icon: 'compass' },
  { id: 'bigdata', label: 'Dane rynkowe', icon: 'chart' },
  {
    id: 'komunikacja', label: 'Komunikacja i marka', icon: 'share', children: [
      { id: 'aktualnosci', label: 'Aktualności' },
      { id: 'kalendarz', label: 'Kalendarz' },
      { id: 'social', label: 'Social Media' },
      { id: 'grafika', label: 'Materiały graficzne' }
    ]
  },
  { id: 'kluby', label: 'Kluby zainteresowań', icon: 'compass' },
  {
    id: 'pracownik', label: 'HR', icon: 'badge', children: [
      { id: 'oferty', label: 'Oferty pracy' },
      { id: 'benefity', label: 'Benefity' },
      { id: 'hr', label: 'Dokumenty i kontakt HR' }
    ]
  },
  {
    id: 'pomoc-grupa', label: 'Pomoc techniczna i linki', icon: 'help', children: [
      { id: 'pomoc', label: 'Pomoc techniczna' },
      { id: 'wiki', label: 'Baza wiedzy' }
    ]
  },
  { id: 'rodo', label: 'Ochrona danych osobowych', icon: 'shield' },
  {
    id: 'procedury', label: 'Baza procedur', icon: 'files', children: [
      { id: 'komwew', label: 'Polityka komunikacji zewnętrznej' },
      { id: 'prawne', label: 'Dokumenty prawne i korporacyjne' }
    ]
  },
  { id: 'pliki', label: 'Pliki i formularze', icon: 'files' },
  { id: 'moja', label: 'Twoja przestrzeń', icon: 'chart' }
];

/** Flat route id -> label lookup, for breadcrumb/header/placeholder use. */
export const ROUTE_TITLES: Record<string, string> = NAV.reduce((acc, item) => {
  if (item.children) {
    item.children.forEach(child => { acc[child.id] = child.label; });
  } else {
    acc[item.id] = item.label;
  }
  return acc;
}, {} as Record<string, string>);

export const DEFAULT_ROUTE = 'start';

/** Routes with real (non-shell) implementations. Everything else renders a stub. */
export const IMPLEMENTED_ROUTES: string[] = [];
