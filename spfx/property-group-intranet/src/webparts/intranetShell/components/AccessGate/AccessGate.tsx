import * as React from 'react';
import Icon from '../../design/Icon';
import styles from './AccessGate.module.scss';

export interface IAccessGateProps {
  /** Whether the current user's role can see the real content. */
  accessible: boolean;
  /** Shown once the user asks why they're locked out. */
  explanation: string;
  children: React.ReactNode;
}

/**
 * Shared content-access-gradation wrapper.
 *
 * Business rule (docs/design-handoff.md, docs/benefits-access-gradation.md):
 * content a role can't access stays visible, dimmed, with a "Brak dostępu"
 * badge — never hidden. Clicking a locked item opens an explanation, never
 * a silent no-op. This same component is meant to be reused by both the
 * Benefity cards (Stage 4) and global search results.
 */
const AccessGate: React.FunctionComponent<IAccessGateProps> = ({ accessible, explanation, children }) => {
  const [showExplanation, setShowExplanation] = React.useState(false);

  if (accessible) {
    return <>{children}</>;
  }

  return (
    <div
      className={styles.locked}
      role="button"
      tabIndex={0}
      onClick={() => setShowExplanation(true)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowExplanation(true); } }}
    >
      <span className={styles.badge}>
        <Icon name="lock" size={14} />
        Brak dostępu
      </span>
      <div className={styles.content}>{children}</div>
      {showExplanation && (
        <div className={styles.explanation} onClick={e => e.stopPropagation()}>
          <p>{explanation}</p>
          <button type="button" className={styles.dismiss} onClick={() => setShowExplanation(false)}>
            Zamknij
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessGate;
