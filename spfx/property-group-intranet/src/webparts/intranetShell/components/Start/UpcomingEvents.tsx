import * as React from 'react';
import { IEvent } from '../../data/startTypes';
import styles from './UpcomingEvents.module.scss';

export interface IUpcomingEventsProps {
  events: IEvent[];
}

function owaLink(e: IEvent): string {
  const q: Record<string, string> = {
    path: '/calendar/action/compose', rru: 'addevent', allday: 'true',
    subject: e.title, location: e.location, body: e.desc, startdt: e.start, enddt: e.end
  };
  const query = Object.keys(q).map(k => k + '=' + encodeURIComponent(q[k])).join('&');
  return 'https://outlook.office.com/calendar/0/deeplink/compose?' + query;
}

function downloadIcs(e: IEvent): void {
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

/** Auto-filtered to future events only, empty-state aware — per docs/design-handoff.md. */
const UpcomingEvents: React.FunctionComponent<IUpcomingEventsProps> = ({ events }) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = events.filter(e => new Date(e.start) >= today).sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>Nadchodzące wydarzenia</h3>
      {upcoming.length === 0 && <p className={styles.empty}>Brak nadchodzących wydarzeń.</p>}
      {upcoming.map(e => (
        <div key={e.id} className={styles.event}>
          <div className={styles.dateBadge}>
            <span className={styles.day}>{e.day}</span>
            <span className={styles.month}>{e.month}</span>
          </div>
          <div className={styles.body}>
            <div className={styles.eventTitle}>{e.title}</div>
            <div className={styles.eventMeta}>{e.meta}</div>
            <div className={styles.eventActions}>
              <a href={owaLink(e)} target="_blank" rel="noreferrer" className={styles.eventAction}>Dodaj do Outlooka</a>
              <button type="button" className={styles.eventAction} onClick={() => downloadIcs(e)}>Pobierz .ics</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingEvents;
