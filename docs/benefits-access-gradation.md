# Gradacja dostępu do benefitów pozapłacowych

## Wymóg biznesowy

Dostęp do treści benefitów musi być ograniczony na trzech poziomach:

1. **Wszyscy pracownicy** — pakiet podstawowy (opieka medyczna, karta
   sportowa, dofinansowanie szkoleń językowych).
2. **Menadżerowie** — pakiet podstawowy + dodatki (ubezpieczenie na życie
   w wyższym wariancie, budżet na rozwój kompetencji, samochód służbowy/ryczałt).
3. **Zarząd i dyrektorzy** — pakiet executive (opieka medyczna dla rodziny,
   program emerytalny premium, pakiet relokacyjny).

Pracownik spoza danego poziomu **nie powinien w ogóle wiedzieć**, jakie
dokładnie benefity ma wyższy poziom — w mockupie to rozwiązane przez
przygaszoną kartę z etykietą "Brak dostępu", żeby użytkownik rozumiał
strukturę bez ujawniania szczegółów.

## Model danych

Lista SharePoint `Benefity`:

| Kolumna         | Typ    | Opis                                          |
|-----------------|--------|-----------------------------------------------|
| Tytul           | Text   | Nazwa benefitu                                 |
| Opis            | Text   | Krótki opis                                    |
| PoziomDostepu   | Choice | `Wszyscy` / `Menadzerowie` / `Zarzad`          |
| Kategoria       | Choice | np. Zdrowie / Rozwój / Transport               |

## Grupy Microsoft 365

```powershell
New-PnPGroup -Title "PG-Benefity-Managerowie"
New-PnPGroup -Title "PG-Benefity-Zarzad"
# "Wszyscy pracownicy" = domyślna grupa wszystkich zalogowanych, bez osobnej grupy
```

## Logika w webparcie SPFx (szkic)

```typescript
import { MSGraphClientV3 } from '@microsoft/sp-http';

async function getUserAccessLevel(context: WebPartContext): Promise<string[]> {
  const client: MSGraphClientV3 = await context.msGraphClientFactory.getClient('3');
  const memberships = await client.api('/me/memberOf').get();

  const groupNames: string[] = memberships.value.map((g: any) => g.displayName);
  const levels: string[] = ['Wszyscy'];
  if (groupNames.includes('PG-Benefity-Managerowie')) levels.push('Menadzerowie');
  if (groupNames.includes('PG-Benefity-Zarzad')) levels.push('Zarzad');
  return levels;
}
```

Webpart pobiera listę benefitów, filtruje po `PoziomDostepu` względem
zwróconych `levels`, i renderuje:
- odblokowane karty dla poziomów, do których użytkownik ma dostęp,
- przygaszoną kartę z etykietą "Brak dostępu" dla poziomów wyższych
  (bez ujawniania treści).

## Zabezpieczenie na poziomie SharePoint (krytyczne)

Samo filtrowanie w UI nie wystarczy. Wymagane dodatkowo:

- Break permission inheritance na elementach listy z `PoziomDostepu =
  Zarzad`, tak żeby tylko grupa `PG-Benefity-Zarzad` (+ administratorzy)
  mieli faktyczny dostęp do odczytu tych rekordów przez REST API / Graph /
  eksport.
- Analogicznie dla `Menadzerowie`.
- Test: użytkownik spoza grupy nie powinien uzyskać danych nawet przez
  bezpośrednie zapytanie do REST API listy, nie tylko przez UI webpartu.
