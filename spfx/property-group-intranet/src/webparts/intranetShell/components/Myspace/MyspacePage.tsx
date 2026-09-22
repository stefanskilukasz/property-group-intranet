import * as React from 'react';
import { StockWatchlist } from '../Start/SidebarWidgets';
import styles from './MyspacePage.module.scss';

/**
 * "Twoja przestrzeń": private, per-user utility page — currently just the
 * stock watchlist, per docs/design-handoff.md ("nothing here is shared
 * across users"). Reuses the same StockWatchlist widget Start uses in its
 * sidebar, at full width.
 */
const MyspacePage: React.FunctionComponent = () => (
  <div className={styles.page}>
    <header className={styles.pageHeader}>
      <span className={styles.badge}>Prywatne</span>
      <h1 className={styles.title}>Twoja przestrzeń</h1>
      <p className={styles.lead}>
        Nic na tej stronie nie jest współdzielone z innymi — dane są zapisywane tylko w Twojej przeglądarce.
      </p>
    </header>
    <div className={styles.widgetWrap}>
      <StockWatchlist />
    </div>
  </div>
);

export default MyspacePage;
