import * as React from 'react';
import styles from './IntranetShell.module.scss';
import type { IIntranetShellProps } from './IIntranetShellProps';
import Sidebar from './Sidebar/Sidebar';
import Header, { Role } from './Header/Header';
import ContentPlaceholder from './ContentPlaceholder/ContentPlaceholder';
import GenericPage from './GenericPage/GenericPage';
import StartPage from './Start/StartPage';
import { ROUTE_TITLES, DEFAULT_ROUTE } from '../design/navigation';
import { typography } from '../design/tokens';
import { LocalPageDataService } from '../data/LocalPageDataService';

const pageDataService = new LocalPageDataService();

const FONTS_LINK_ID = 'pg-intranet-fonts';

function ensureFontsLoaded(): void {
  if (typeof document === 'undefined' || document.getElementById(FONTS_LINK_ID)) {
    return;
  }
  const link = document.createElement('link');
  link.id = FONTS_LINK_ID;
  link.rel = 'stylesheet';
  link.href = typography.googleFontsUrl;
  document.head.appendChild(link);
}

function routeFromHistory(): string {
  const state = typeof window !== 'undefined' ? window.history.state : undefined;
  return (state && state.pgRoute) || DEFAULT_ROUTE;
}

const IntranetShell: React.FunctionComponent<IIntranetShellProps> = ({ userDisplayName }) => {
  const [route, setRoute] = React.useState<string>(routeFromHistory);
  const [role, setRole] = React.useState<Role>('Wszyscy');
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    ensureFontsLoaded();

    const onPopState = (): void => setRoute(routeFromHistory());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextRoute: string): void => {
    if (nextRoute === route) {
      return;
    }
    window.history.pushState({ pgRoute: nextRoute }, '');
    setRoute(nextRoute);
  };

  const title = ROUTE_TITLES[route] || 'Start';
  const pageData = pageDataService.getPage(route);

  return (
    <div className={`${styles.shell} ${darkMode ? styles.shellDark : ''}`}>
      <Sidebar activeRoute={route} onNavigate={navigate} />
      <div className={styles.main}>
        <Header
          breadcrumb={title}
          role={role}
          onRoleChange={setRole}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(v => !v)}
        />
        <div className={styles.content}>
          {route === 'start'
            ? <StartPage userDisplayName={userDisplayName} dataService={pageDataService} onNavigate={navigate} />
            : pageData
              ? <GenericPage page={pageData} brands={pageDataService.getBrands()} />
              : <ContentPlaceholder title={title} route={route} />}
        </div>
      </div>
    </div>
  );
};

export default IntranetShell;
