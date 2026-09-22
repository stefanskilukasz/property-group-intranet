import * as React from 'react';
import { IEvent } from '../../data/startTypes';
import { owaLink, downloadIcs } from '../../utils/events';
import styles from './UpcomingEvents.module.scss';

export interface IUpcomingEventsProps {
  events: IEvent[];
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
