import * as React from 'react';
import Icon from '../../design/Icon';
import { IEvent } from '../../data/startTypes';
import { ICalGridBlock, IOutlookBlock } from '../../data/pageTypes';
import { isoDate, owaLink, downloadIcs } from '../../utils/events';
import styles from './CalendarBlocks.module.scss';

const MONTH_NAMES = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
const WEEKDAY_LETTERS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export interface ICalGridBlockProps {
  block: ICalGridBlock;
  events: IEvent[];
}

/**
 * Full month-grid calendar of company events — the `calgrid` block from
 * design/Intranet Property Group.dc.html's Kalendarz page (buildMonthGrid).
 * Same day-highlighting approach as Start's MiniCalendar, at full size,
 * plus a details list for every event in the visible month.
 */
export const CalGridBlock: React.FunctionComponent<ICalGridBlockProps> = ({ block, events }) => {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  const eventsByDate = React.useMemo(() => {
    const map: Record<string, IEvent[]> = {};
    events.forEach(e => {
      (map[e.start] = map[e.start] || []).push(e);
    });
    return map;
  }, [events]);

  const monthEvents = React.useMemo(
    () => events
      .filter(e => e.start.slice(0, 7) === `${year}-${String(month + 1).padStart(2, '0')}`)
      .sort((a, b) => a.start.localeCompare(b.start)),
    [events, year, month]
  );

  const firstOfMonth = new Date(year, month, 1);
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
    setSelected(undefined);
  };

  return (
    <div className={styles.calGrid}>
      {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}

      <div className={styles.header}>
        <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)} aria-label="Poprzedni miesiąc">‹</button>
        <div className={styles.monthLabel}>{MONTH_NAMES[month]} {year}</div>
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
          const dayEvents = eventsByDate[iso] || [];
          const isToday = isoDate(today) === iso;
          const isSelected = selected === iso;
          return (
            <button
              key={i}
              type="button"
              className={`${styles.cell} ${isToday ? styles.cellToday : ''} ${dayEvents.length ? styles.cellEvent : ''} ${isSelected ? styles.cellSelected : ''}`}
              onClick={dayEvents.length ? () => setSelected(isSelected ? undefined : iso) : undefined}
              disabled={!dayEvents.length}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className={styles.eventList}>
        {monthEvents.length === 0 && <p className={styles.empty}>Brak wydarzeń w tym miesiącu.</p>}
        {monthEvents.map(e => (
          <div key={e.id} className={`${styles.eventCard} ${selected === e.start ? styles.eventCardHighlighted : ''}`}>
            <div className={styles.eventDateBadge}>
              <span className={styles.eventDay}>{e.day}</span>
              <span className={styles.eventMonth}>{e.month}</span>
            </div>
            <div className={styles.eventBody}>
              <div className={styles.eventTitle}>{e.title}</div>
              <div className={styles.eventMeta}>{e.meta}</div>
              {e.desc && <p className={styles.eventDesc}>{e.desc}</p>}
              <div className={styles.eventActions}>
                <a href={owaLink(e)} target="_blank" rel="noreferrer" className={styles.eventAction}>Dodaj do Outlooka</a>
                <button type="button" className={styles.eventAction} onClick={() => downloadIcs(e)}>Pobierz .ics</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OutlookBlock: React.FunctionComponent<{ block: IOutlookBlock }> = ({ block }) => (
  <div className={styles.outlookBlock}>
    {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
    <div className={styles.outlookPlaceholder}>
      <Icon name="calendar" size={22} className={styles.outlookIcon} />
      <div>
        <div className={styles.outlookHeading}>Integracja z Outlookiem jeszcze nieaktywna</div>
        {block.note && <p className={styles.outlookNote}>{block.note}</p>}
      </div>
    </div>
  </div>
);
