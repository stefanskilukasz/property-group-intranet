import * as React from 'react';
import { IEvent } from '../../data/startTypes';
import styles from './MiniCalendar.module.scss';

const MONTH_NAMES = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
const WEEKDAY_LETTERS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export interface IMiniCalendarProps {
  events: IEvent[];
  onOpenCalendar: () => void;
}

/**
 * Local-calendar-date ISO string (YYYY-MM-DD). Deliberately not
 * `d.toISOString()`, which converts to UTC first and can shift the date by
 * one day for any timezone ahead of UTC (e.g. Poland) — that bug made
 * event markers land on the wrong day.
 */
function isoDate(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const MiniCalendar: React.FunctionComponent<IMiniCalendarProps> = ({ events, onOpenCalendar }) => {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());

  const eventDates = React.useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => set.add(e.start));
    return set;
  }, [events]);

  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0=Sun..6=Sat; shift so the grid starts on Monday.
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | undefined)[] = [
    ...Array(leadingBlanks).fill(undefined),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const changeMonth = (delta: number): void => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)} aria-label="Poprzedni miesiąc">‹</button>
        <button type="button" className={styles.monthLabel} onClick={onOpenCalendar}>
          {MONTH_NAMES[month]} {year}
        </button>
        <button type="button" className={styles.navButton} onClick={() => changeMonth(1)} aria-label="Następny miesiąc">›</button>
      </div>

      <div className={styles.weekdayRow}>
        {WEEKDAY_LETTERS.map(w => <span key={w}>{w}</span>)}
      </div>

      <div className={styles.grid}>
        {cells.map((day, i) => {
          if (day === undefined) {
            return <span key={i} className={styles.cellEmpty} />;
          }
          const date = new Date(year, month, day);
          const iso = isoDate(date);
          const hasEvent = eventDates.has(iso);
          const isToday = isoDate(today) === iso;
          return (
            <button
              key={i}
              type="button"
              className={`${styles.cell} ${isToday ? styles.cellToday : ''} ${hasEvent ? styles.cellEvent : ''}`}
              onClick={hasEvent ? onOpenCalendar : undefined}
              disabled={!hasEvent}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
