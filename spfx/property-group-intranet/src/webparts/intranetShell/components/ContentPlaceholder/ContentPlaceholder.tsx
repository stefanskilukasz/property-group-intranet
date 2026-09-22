import * as React from 'react';
import styles from './ContentPlaceholder.module.scss';

export interface IContentPlaceholderProps {
  title: string;
  route: string;
}

/**
 * Stand-in for pages not yet built (Stage 2+ per the SPFx rebuild plan).
 * Deliberately honest about being unbuilt rather than faking content —
 * matches CLAUDE.md's "no fake CTAs / no fake preview data" rule.
 */
const ContentPlaceholder: React.FunctionComponent<IContentPlaceholderProps> = ({ title, route }) => (
  <div className={styles.placeholder}>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.note}>
      Ta strona (<code>{route}</code>) jeszcze nie została zbudowana w wersji SPFx —
      zawartość zostanie dodana w kolejnym etapie prac.
    </p>
  </div>
);

export default ContentPlaceholder;
