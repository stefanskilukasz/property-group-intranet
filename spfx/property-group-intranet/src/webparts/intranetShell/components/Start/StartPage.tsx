import * as React from 'react';
import { vocative, greetingForHour } from '../../utils/greeting';
import { formatFullDate } from '../../utils/dates';
import { IPageDataService } from '../../data/IPageDataService';
import TodayCard from './TodayCard';
import MiniCalendar from './MiniCalendar';
import ShortcutsWidget from './ShortcutsWidget';
import NewsFeed from './NewsFeed';
import UpcomingEvents from './UpcomingEvents';
import { NewJoiners, BrandStrip, StockWatchlist } from './SidebarWidgets';
import styles from './StartPage.module.scss';

export interface IStartPageProps {
  userDisplayName: string;
  dataService: IPageDataService;
  onNavigate: (route: string) => void;
}

const StartPage: React.FunctionComponent<IStartPageProps> = ({ userDisplayName, dataService, onNavigate }) => {
  const now = new Date();
  const greeting = greetingForHour(now.getHours());
  const name = vocative(userDisplayName);

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <header className={styles.greeting}>
          <h1 className={styles.greetingTitle}>{greeting}{name ? ', ' + name : ''}!</h1>
          <p className={styles.greetingDate}>{formatFullDate(now)}</p>
        </header>

        <ShortcutsWidget
          catalog={dataService.getShortcutCatalog()}
          defaultKeys={dataService.getDefaultShortcutKeys()}
          onNavigate={onNavigate}
        />

        <NewsFeed items={dataService.getNews()} reactionDefs={dataService.getReactionDefs()} />
      </div>

      <div className={styles.sidebar}>
        <TodayCard />
        <MiniCalendar events={dataService.getEvents()} onOpenCalendar={() => onNavigate('kalendarz')} />
        <UpcomingEvents events={dataService.getEvents()} />
        <NewJoiners />
        <BrandStrip brands={dataService.getBrands()} />
        <StockWatchlist />
      </div>
    </div>
  );
};

export default StartPage;
