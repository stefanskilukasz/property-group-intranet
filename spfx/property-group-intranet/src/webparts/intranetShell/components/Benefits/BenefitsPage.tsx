import * as React from 'react';
import Icon from '../../design/Icon';
import AccessGate from '../AccessGate/AccessGate';
import { IBenefit } from '../../data/benefitsTypes';
import { Role } from '../Header/Header';
import styles from './BenefitsPage.module.scss';

export interface IBenefitsPageProps {
  benefits: IBenefit[];
  role: Role;
}

/** Wszyscy sees "all"-tier only; Menadzerowie/Zarzad also see "manager"-tier. */
function isAccessible(benefit: IBenefit, role: Role): boolean {
  return benefit.tier === 'all' || role === 'Menadzerowie' || role === 'Zarzad';
}

const BenefitCard: React.FunctionComponent<{ benefit: IBenefit; onOpen: () => void }> = ({ benefit, onOpen }) => (
  <button type="button" className={styles.card} onClick={onOpen}>
    <Icon name={benefit.icon} size={26} className={styles.cardIcon} />
    <div className={styles.cardTitle}>{benefit.title}</div>
    <p className={styles.cardShort}>{benefit.short}</p>
    <div className={styles.cardChips}>
      {benefit.chips.map((c, i) => <span key={i} className={styles.chip}>{c}</span>)}
    </div>
  </button>
);

const BenefitDetailModal: React.FunctionComponent<{ benefit: IBenefit; onClose: () => void }> = ({ benefit, onClose }) => (
  <div className={styles.modalOverlay} onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Zamknij">
        <Icon name="close" size={16} />
      </button>

      <div className={styles.modalHeader}>
        <Icon name={benefit.icon} size={28} className={styles.modalIcon} />
        <h2 className={styles.modalTitle}>{benefit.title}</h2>
      </div>

      <p className={styles.modalDesc}>{benefit.desc}</p>

      {benefit.funding && (
        <div className={styles.fundingGrid}>
          {benefit.funding.map((f, i) => (
            <div key={i} className={styles.fundingItem}>
              <div className={styles.fundingRole}>{f.role}</div>
              <div className={styles.fundingAmount}>{f.amount}</div>
              <div className={styles.fundingNote}>{f.note}</div>
            </div>
          ))}
        </div>
      )}

      {benefit.table && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th />
                {benefit.table.cols.map(c => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {benefit.table.rows.map((row, i) => (
                <tr key={i}>
                  <td>
                    <div className={styles.tableRowLabel}>{row.label}</div>
                    {row.sub && <div className={styles.tableRowSub}>{row.sub}</div>}
                  </td>
                  {row.cells.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          {benefit.table.note && <p className={styles.tableNote}>{benefit.table.note}</p>}
        </div>
      )}

      {benefit.addons && (
        <div className={styles.addons}>
          <h3 className={styles.sectionTitle}>Dodatki</h3>
          {benefit.addons.map((a, i) => (
            <div key={i} className={styles.addon}>
              <div className={styles.addonName}>{a.name}</div>
              <div className={styles.addonParts}>{a.parts.join(' · ')}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.steps}>
        <h3 className={styles.sectionTitle}>Jak skorzystać</h3>
        <ol className={styles.stepsList}>
          {benefit.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </div>

      {benefit.docs.length > 0 && (
        <div className={styles.docs}>
          <h3 className={styles.sectionTitle}>Materiały</h3>
          <ul className={styles.docsList}>
            {benefit.docs.map((d, i) => (
              <li key={i}>
                {d.href
                  ? <a href={d.href} target="_blank" rel="noreferrer">{d.label}</a>
                  : <span className={styles.docNoLink}>{d.label}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.modalFooter}>
        <div className={styles.owner}>{benefit.owner}</div>
        {benefit.contact && (
          <a href={`mailto:${benefit.contact}`} className={styles.ctaButton}>{benefit.cta}</a>
        )}
      </div>
    </div>
  </div>
);

const LockedExplanation: React.FunctionComponent<{ benefit: IBenefit }> = ({ benefit }) => (
  <div className={styles.lockedCard}>
    <Icon name={benefit.icon} size={26} className={styles.cardIcon} />
    <div className={styles.cardTitle}>{benefit.title}</div>
  </div>
);

const BenefitsPage: React.FunctionComponent<IBenefitsPageProps> = ({ benefits, role }) => {
  const [openId, setOpenId] = React.useState<string | undefined>(undefined);
  const openBenefit = benefits.find(b => b.id === openId);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <span className={styles.badge}>Dla pracownika</span>
        <h1 className={styles.title}>Benefity</h1>
        <p className={styles.lead}>
          Pakiet medyczny, karta sportowa i ubezpieczenie na życie — zakres zależy od Twojej roli.
          Karty, do których nie masz dostępu, zostają widoczne (przyciemnione), żebyś wiedział, że istnieją i do kogo się zgłosić.
        </p>
      </header>

      <div className={styles.grid}>
        {benefits.map(benefit => (
          <AccessGate
            key={benefit.id}
            accessible={isAccessible(benefit, role)}
            explanation={`Ten benefit jest dostępny dla roli: ${benefit.tier === 'manager' ? 'Menadżerowie i Zarząd' : 'Wszyscy'}. Zapytaj HR (${benefit.owner}), jeśli uważasz, że powinieneś mieć dostęp.`}
          >
            {isAccessible(benefit, role)
              ? <BenefitCard benefit={benefit} onOpen={() => setOpenId(benefit.id)} />
              : <LockedExplanation benefit={benefit} />}
          </AccessGate>
        ))}
      </div>

      {openBenefit && <BenefitDetailModal benefit={openBenefit} onClose={() => setOpenId(undefined)} />}
    </div>
  );
};

export default BenefitsPage;
