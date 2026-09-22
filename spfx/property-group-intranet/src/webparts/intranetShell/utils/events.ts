import { IEvent } from '../data/startTypes';

/** Outlook Web "add this event" deep link — ported from the prototype's owaLink(). */
export function owaLink(e: IEvent): string {
  const q: Record<string, string> = {
    path: '/calendar/action/compose', rru: 'addevent', allday: 'true',
    subject: e.title, location: e.location, body: e.desc, startdt: e.start, enddt: e.end
  };
  const query = Object.keys(q).map(k => k + '=' + encodeURIComponent(q[k])).join('&');
  return 'https://outlook.office.com/calendar/0/deeplink/compose?' + query;
}

/** Downloads a standalone .ics file for the event — ported from the prototype's downloadIcs(). */
export function downloadIcs(e: IEvent): void {
  const d = (s: string): string => s.replace(/-/g, '');
  const esc = (s: string): string => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Property Group//Intranet//PL', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', 'UID:' + e.id + '@intranet.propertygroup.pl',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    'DTSTART;VALUE=DATE:' + d(e.start), 'DTEND;VALUE=DATE:' + d(e.end),
    'SUMMARY:' + esc(e.title), 'LOCATION:' + esc(e.location), 'DESCRIPTION:' + esc(e.desc),
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = e.title.replace(/\s+/g, '-').toLowerCase() + '.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Local-calendar-date ISO string (YYYY-MM-DD) — not toISOString(), which shifts by a day in timezones ahead of UTC. */
export function isoDate(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
