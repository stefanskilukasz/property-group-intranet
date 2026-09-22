import * as React from 'react';
import { IDeptsBlock, IOfficeMapBlock } from '../../data/pageTypes';
import { IPlace, IStreet } from '../../data/directoryTypes';
import { getDeptGroups } from '../../utils/directory';
import { setDirectoryFilter } from '../../utils/directoryFilterBridge';
import { normalizeForSearch } from '../../utils/text';
import officeMapImage from '../../assets/mapa-biura.png';
import styles from './DirectoryBlocks.module.scss';

export const DeptsBlock: React.FunctionComponent<{ block: IDeptsBlock; onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const groups = React.useMemo(getDeptGroups, []);

  const openDept = (dept: string): void => {
    setDirectoryFilter({ dept });
    onNavigate('zespol');
  };

  return (
    <div className={styles.deptsBlock}>
      {groups.map(group => (
        <div key={group.pion} className={styles.pionGroup}>
          <div className={styles.pionHeader}>
            <div>
              <div className={styles.pionName}>{group.pion}</div>
              <div className={styles.pionHead}>{group.head} · {group.count} os.</div>
            </div>
          </div>
          <div className={styles.deptGrid}>
            {group.depts.map(d => (
              <button key={d.name} type="button" className={styles.deptCard} onClick={() => openDept(d.name)}>
                <div className={styles.deptName}>{d.name}</div>
                <div className={styles.deptHead}>{d.head} — {d.headRole}</div>
                <div className={styles.deptMeta}>{d.count} os. · {d.teams}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PLACE_CHIPS: { id: 'all' | IPlace['t']; label: string }[] = [
  { id: 'all', label: 'Wszystko' },
  { id: 'sala', label: 'Sale i fokus' },
  { id: 'zespol', label: 'Zespoły' },
  { id: 'udog', label: 'Udogodnienia' }
];

export interface IOfficeMapBlockProps {
  block: IOfficeMapBlock;
  places: IPlace[];
  streets: IStreet[];
  onNavigate: (route: string) => void;
}

export const OfficeMapBlock: React.FunctionComponent<IOfficeMapBlockProps> = ({ block, places, streets, onNavigate }) => {
  const [chip, setChip] = React.useState<'all' | IPlace['t']>('all');
  const [query, setQuery] = React.useState('');

  const normalizedQuery = normalizeForSearch(query.trim());
  const filtered = places.filter(p => {
    if (chip !== 'all' && p.t !== chip) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return normalizeForSearch(p.n + ' ' + p.s + ' ' + p.m).indexOf(normalizedQuery) >= 0;
  });

  const streetByName = React.useMemo(() => {
    const map: Record<string, IStreet> = {};
    streets.forEach(s => { map[s.name] = s; });
    return map;
  }, [streets]);

  return (
    <div className={styles.officeMap}>
      {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
      {block.note && <p className={styles.officeMapNote}>{block.note}</p>}

      <div className={styles.mapImageWrap}>
        <img src={officeMapImage} alt="Plan piętra biura" className={styles.mapImage} />
      </div>

      <div className={styles.legend}>
        {streets.map(s => (
          <div key={s.id} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: s.color }} />
            <div>
              <div className={styles.legendName}>{s.name}</div>
              <div className={styles.legendDesc}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.searchRow}>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Szukaj miejsca, np. „Ratusz”…"
          className={styles.searchInput}
        />
        <div className={styles.chips}>
          {PLACE_CHIPS.map(c => (
            <button
              key={c.id}
              type="button"
              className={`${styles.chip} ${chip === c.id ? styles.chipActive : ''}`}
              onClick={() => setChip(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <ul className={styles.placeList}>
        {filtered.map((p, i) => {
          const street = streetByName[p.s];
          return (
            <li key={i} className={styles.placeItem}>
              {street && <span className={styles.placeSwatch} style={{ backgroundColor: street.color }} />}
              <div className={styles.placeBody}>
                <div className={styles.placeName}>{p.n}{p.c ? ` · ${p.c} os.` : ''}</div>
                <div className={styles.placeMeta}>{p.s} — {p.m}</div>
              </div>
              {p.t === 'zespol' && (
                <button
                  type="button"
                  className={styles.placeAction}
                  onClick={() => { setDirectoryFilter({ dept: undefined, query: p.n }); onNavigate('zespol'); }}
                >
                  Zobacz zespół
                </button>
              )}
            </li>
          );
        })}
        {filtered.length === 0 && <p className={styles.empty}>Brak wyników.</p>}
      </ul>
    </div>
  );
};
