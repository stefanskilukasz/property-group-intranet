import * as React from 'react';
import Icon from '../../design/Icon';
import { loadWeather, wxMeta, IWeather } from '../../utils/weather';
import { nextHoliday, daysBetween } from '../../utils/holidays';
import { WEEKDAYS, MONTHS_GENITIVE } from '../../utils/dates';
import styles from './TodayCard.module.scss';

type WxState = 'loading' | 'ok' | 'error';

const TodayCard: React.FunctionComponent = () => {
  const [wx, setWx] = React.useState<IWeather | undefined>(undefined);
  const [wxState, setWxState] = React.useState<WxState>('loading');

  React.useEffect(() => {
    let cancelled = false;
    loadWeather()
      .then(data => { if (!cancelled) { setWx(data); setWxState('ok'); } })
      .catch(() => { if (!cancelled) { setWxState('error'); } });
    return () => { cancelled = true; };
  }, []);

  const now = new Date();
  const holiday = nextHoliday(now);
  const holidayDays = holiday ? daysBetween(new Date(now.getFullYear(), now.getMonth(), now.getDate()), holiday.date) : undefined;
  const meta = wx ? wxMeta(wx.code, wx.isDay) : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.dateRow}>
        <div className={styles.weekday}>{WEEKDAYS[now.getDay()]}</div>
        <div className={styles.date}>{now.getDate()} {MONTHS_GENITIVE[now.getMonth()]}</div>
      </div>

      <div className={styles.weather}>
        {wxState === 'loading' && <span className={styles.wxNote}>Ładowanie pogody…</span>}
        {wxState === 'error' && <span className={styles.wxNote}>Pogoda niedostępna</span>}
        {wxState === 'ok' && wx && meta && (
          <>
            <Icon name={meta.icon} size={30} className={styles.wxIcon} />
            <div>
              <div className={styles.wxTemp}>{wx.temp}°C</div>
              <div className={styles.wxLabel}>{meta.label} · odczuwalna {wx.feels}°C</div>
              <div className={styles.wxMinMax}>{wx.min}° / {wx.max}° · {wx.place}</div>
            </div>
          </>
        )}
      </div>

      {holiday && holidayDays !== undefined && (
        <div className={styles.holiday}>
          Do dnia wolnego (<strong>{holiday.name}</strong>) zostało <strong>{holidayDays} {holidayDays === 1 ? 'dzień' : 'dni'}</strong>.
        </div>
      )}
    </div>
  );
};

export default TodayCard;
