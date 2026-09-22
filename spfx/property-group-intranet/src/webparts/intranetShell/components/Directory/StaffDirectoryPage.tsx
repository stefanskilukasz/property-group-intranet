import * as React from 'react';
import { getStaff, getDeptList } from '../../utils/directory';
import { consumeDirectoryFilter } from '../../utils/directoryFilterBridge';
import { normalizeForSearch } from '../../utils/text';
import { IStaffMember } from '../../data/directoryTypes';
import styles from './StaffDirectoryPage.module.scss';

const ALL_STAFF = getStaff();
const BOARD = ALL_STAFF.filter(p => p.isBoard);
const STAFF = ALL_STAFF.filter(p => !p.isBoard);
const DEPT_LIST = getDeptList();

const PersonCard: React.FunctionComponent<{ person: IStaffMember }> = ({ person }) => (
  <div className={styles.personCard}>
    <div className={styles.avatar}>{person.initials}</div>
    <div className={styles.personBody}>
      <div className={styles.personName}>{person.name}</div>
      <div className={styles.personRole}>{person.role}</div>
    </div>
  </div>
);

/**
 * "Departamenty i kontakty" staff directory — search + department filter,
 * grouped by department (collapsible, auto-expanded only when filtered/
 * searched or a single group remains), per docs/design-handoff.md. Can be
 * pre-filtered via directoryFilterBridge (a department chip or office-map
 * place elsewhere deep-links here).
 */
const StaffDirectoryPage: React.FunctionComponent = () => {
  const initial = React.useMemo(consumeDirectoryFilter, []);
  const [query, setQuery] = React.useState(initial?.query || '');
  const [dept, setDept] = React.useState(initial?.dept || 'all');

  const normalizedQuery = normalizeForSearch(query.trim());
  const filtered = STAFF.filter(p => {
    if (dept !== 'all' && p.dept !== dept) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return normalizeForSearch(`${p.name} ${p.role} ${p.dept} ${p.team}`).indexOf(normalizedQuery) >= 0;
  });

  const groups: { dept: string; people: IStaffMember[] }[] = [];
  filtered.forEach(p => {
    let group = groups.filter(g => g.dept === p.dept)[0];
    if (!group) {
      group = { dept: p.dept, people: [] };
      groups.push(group);
    }
    group.people.push(p);
  });

  const autoExpand = !!normalizedQuery || dept !== 'all' || groups.length <= 1;
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const isExpanded = (d: string): boolean => autoExpand || !!expanded[d];

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <span className={styles.badge}>O firmie</span>
        <h1 className={styles.title}>Departamenty i kontakty</h1>
        <p className={styles.lead}>Pełny katalog pracowników — szukaj po imieniu, roli lub dziale.</p>
      </header>

      {BOARD.length > 0 && (
        <section className={styles.boardSection}>
          <h2 className={styles.sectionTitle}>Zarząd</h2>
          <div className={styles.peopleGrid}>
            {BOARD.map(p => <PersonCard key={p.id} person={p} />)}
          </div>
        </section>
      )}

      <div className={styles.controls}>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Szukaj osoby, roli, działu…"
          className={styles.searchInput}
        />
        <select value={dept} onChange={e => setDept(e.target.value)} className={styles.deptSelect}>
          <option value="all">Wszystkie działy</option>
          {DEPT_LIST.map(d => (
            <option key={d.name} value={d.name}>{d.name} ({d.count})</option>
          ))}
        </select>
      </div>

      {groups.length === 0 && <p className={styles.empty}>Brak wyników.</p>}

      <div className={styles.groups}>
        {groups.map(g => (
          <section key={g.dept} className={styles.deptSection}>
            <button
              type="button"
              className={styles.deptHeader}
              onClick={() => setExpanded(prev => ({ ...prev, [g.dept]: !isExpanded(g.dept) }))}
            >
              <span>{g.dept}</span>
              <span className={styles.deptCount}>{g.people.length}</span>
            </button>
            {isExpanded(g.dept) && (
              <div className={styles.peopleGrid}>
                {g.people.map(p => <PersonCard key={p.id} person={p} />)}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default StaffDirectoryPage;
