/**
 * Polish public holidays — fixed dates plus Easter (Gauss's algorithm, since
 * the movable holidays derive from it). Ported verbatim from the prototype.
 */
export interface IHoliday {
  name: string;
  date: Date;
}

export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function polishHolidays(year: number): IHoliday[] {
  const easter = easterSunday(year);
  const plus = (n: number): Date => {
    const d = new Date(easter.getTime());
    d.setDate(d.getDate() + n);
    return d;
  };
  return [
    { name: 'Nowy Rok', date: new Date(year, 0, 1) },
    { name: 'Trzech Króli', date: new Date(year, 0, 6) },
    { name: 'Wielkanoc (Poniedziałek)', date: plus(1) },
    { name: 'Święto Pracy', date: new Date(year, 4, 1) },
    { name: 'Święto Konstytucji 3 Maja', date: new Date(year, 4, 3) },
    { name: 'Zielone Świątki', date: plus(49) },
    { name: 'Boże Ciało', date: plus(60) },
    { name: 'Wniebowzięcie NMP', date: new Date(year, 7, 15) },
    { name: 'Wszystkich Świętych', date: new Date(year, 10, 1) },
    { name: 'Święto Niepodległości', date: new Date(year, 10, 11) },
    { name: 'Boże Narodzenie', date: new Date(year, 11, 25) },
    { name: 'Drugi dzień Świąt', date: new Date(year, 11, 26) }
  ];
}

/** Next holiday that isn't already a weekend (matches the prototype's rule). */
export function nextHoliday(now: Date): IHoliday | undefined {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const all = polishHolidays(now.getFullYear()).concat(polishHolidays(now.getFullYear() + 1));
  const upcoming = all.filter(h => h.date > today && h.date.getDay() !== 0 && h.date.getDay() !== 6);
  upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
  return upcoming[0];
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
