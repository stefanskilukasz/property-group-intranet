import * as React from 'react';
import { IBrand } from '../../data/pageTypes';
import styles from './SidebarWidgets.module.scss';

/**
 * "Nowi w zespole": no real data source found in the prototype (only a
 * heading in a static preview snippet) — docs/design-handoff.md calls it
 * "empty-state aware", so this stays an honest empty state rather than
 * fabricated names.
 */
export const NewJoiners: React.FunctionComponent = () => (
  <div className={styles.widget}>
    <h3 className={styles.title}>Nowi w zespole</h3>
    <p className={styles.empty}>Brak nowych osób w tym tygodniu.</p>
  </div>
);

export const BrandStrip: React.FunctionComponent<{ brands: IBrand[] }> = ({ brands }) => (
  <div className={styles.widget}>
    <h3 className={styles.title}>Marki i projekty grupy</h3>
    <div className={styles.brandStrip}>
      {brands.map((b, i) => (
        <a key={i} href={b.url} target="_blank" rel="noreferrer" className={styles.brandChip}>
          {b.name}
        </a>
      ))}
    </div>
  </div>
);

const WATCHLIST_KEY = 'pg-intranet-watchlist';

function loadTickers(): string[] {
  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // localStorage unavailable — start empty
  }
  return [];
}

function saveTickers(list: string[]): void {
  try {
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  } catch {
    // best-effort only
  }
}

/**
 * "Twoja giełda": private per-browser watchlist, localStorage-only — per
 * docs/design-handoff.md, which explicitly flags this as needing a real
 * per-user store (e.g. Graph me/insights-style) in production. Live prices
 * aren't wired up here (would need a market-data API/key) — this stage
 * only ports the ticker list itself.
 */
export const StockWatchlist: React.FunctionComponent = () => {
  const [tickers, setTickers] = React.useState<string[]>(loadTickers);
  const [draft, setDraft] = React.useState('');

  const addTicker = (e: React.FormEvent): void => {
    e.preventDefault();
    const symbol = draft.trim().toUpperCase();
    if (!symbol || tickers.includes(symbol)) {
      return;
    }
    const next = [...tickers, symbol];
    setTickers(next);
    saveTickers(next);
    setDraft('');
  };

  const removeTicker = (symbol: string): void => {
    const next = tickers.filter(t => t !== symbol);
    setTickers(next);
    saveTickers(next);
  };

  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>Twoja giełda</h3>
      {tickers.length === 0 && <p className={styles.empty}>Dodaj spółki, które chcesz obserwować.</p>}
      <div className={styles.tickers}>
        {tickers.map(t => (
          <span key={t} className={styles.tickerChip}>
            {t}
            <button type="button" className={styles.tickerRemove} onClick={() => removeTicker(t)} aria-label={'Usuń ' + t}>×</button>
          </span>
        ))}
      </div>
      <form className={styles.tickerForm} onSubmit={addTicker}>
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="np. CDR"
          className={styles.tickerInput}
        />
        <button type="submit" className={styles.tickerSubmit}>Dodaj</button>
      </form>
    </div>
  );
};
