# Property Group — Intranet SharePoint

Kontekst dla Claude Code: ten projekt to intranet SharePoint dla Property Group
(rynekpierwotny.pl, GetHome.pl, ESTI CRM, voxDeveloper CRM). Zanim zaczniesz
edytować, przeczytaj `docs/architecture.md` i `docs/benefits-access-gradation.md`.

## Brand / design system (obowiązkowe we wszystkich mockupach i webpartach)

Wzorowane na propertygroup.pl (nie na kolorystyce portalu rynekpierwotny.pl —
to inna marka w tej samej grupie).

- **Nagłówki (h1/h2/h3):** Playfair Display, bold, szeryfowy — nadaje powagi.
- **Treść / UI:** Poppins, sans-serif.
- **Kolor akcentu:** limonkowa zieleń `#AFDE1F` (podkreślenia, badge'e,
  przyciski, kwadratowe punktory list — NIE kropki, kwadraty).
- **Kolor pomocniczy:** turkus `#1C6B6B` (małe okrągłe ikony w topbarze).
- **Tło sekcji hero/wyróżnionych:** jasna lawenda `#F1F0F7`.
- **Karty:** cienka obwódka 1px `#DEDEE2`, kanciaste rogi (max 2px radius) —
  NIE mocno zaokrąglone karty, to nie pasuje do marki.
- Logo wzorowane na "Property**Group**" — druga część nazwy na limonkowym tle.

## Znane błędy do unikania

- NIE używać emoji jako ikon (📰📅🎁) — renderują się niespójnie między
  systemami i psują wyrównanie tekstu. Używać SVG.
- Każdy element z tłem-zdjęciem musi mieć `background-color` jako fallback,
  na wypadek błędnego/niedziałającego URL zdjęcia.
- Ustawiać jawny `line-height` na nagłówkach/etykietach żeby uniknąć
  "rozjeżdżania się" tekstu przy różnej wysokości ikon/zdjęć w wierszu.

## Kluczowy wymóg biznesowy — gradacja dostępu do benefitów

Trzy poziomy: Wszyscy pracownicy / Menadżerowie / Zarząd i dyrektorzy.
Zobacz `docs/benefits-access-gradation.md` — **filtrowanie w UI to za mało,
musi być też zabezpieczone na poziomie list/uprawnień SharePoint.**
