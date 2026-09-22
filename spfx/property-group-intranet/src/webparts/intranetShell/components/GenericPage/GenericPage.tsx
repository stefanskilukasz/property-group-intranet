import * as React from 'react';
import { IPageData } from '../../data/pageTypes';
import { IPageDataService } from '../../data/IPageDataService';
import { BlockRenderer } from '../blocks/Blocks';
import styles from './GenericPage.module.scss';

export interface IGenericPageProps {
  page: IPageData;
  dataService: IPageDataService;
  onNavigate: (route: string) => void;
}

const GenericPage: React.FunctionComponent<IGenericPageProps> = ({ page, dataService, onNavigate }) => (
  <div className={styles.page}>
    <header className={styles.pageHeader}>
      {page.badge && <span className={styles.badge}>{page.badge}</span>}
      <h1 className={styles.title}>{page.title}</h1>
      {page.lead && <p className={styles.lead}>{page.lead}</p>}
    </header>

    <div className={styles.blocks}>
      {page.blocks.map((block, i) => (
        <section key={i} className={styles.blockWrap}>
          <BlockRenderer
            block={block}
            brands={dataService.getBrands()}
            kbEntries={dataService.getKbEntries()}
            events={dataService.getEvents()}
            news={dataService.getNews()}
            reactionDefs={dataService.getReactionDefs()}
            places={dataService.getPlaces()}
            streets={dataService.getStreets()}
            onNavigate={onNavigate}
          />
        </section>
      ))}
    </div>

    {(page.footerTitle || page.footerText) && (
      <footer className={styles.footer}>
        {page.footerTitle && <div className={styles.footerTitle}>{page.footerTitle}</div>}
        {page.footerText && <p className={styles.footerText}>{page.footerText}</p>}
      </footer>
    )}
  </div>
);

export default GenericPage;
