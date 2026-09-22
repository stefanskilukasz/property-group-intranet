import * as React from 'react';
import Icon from '../../design/Icon';
import styles from './Header.module.scss';

export type Role = 'Wszyscy' | 'Menadzerowie' | 'Zarzad';

export const ROLE_LABELS: Record<Role, string> = {
  Wszyscy: 'Wszyscy',
  Menadzerowie: 'Menadżerowie',
  Zarzad: 'Zarząd'
};

export interface IHeaderProps {
  breadcrumb: string;
  role: Role;
  onRoleChange: (role: Role) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

/**
 * "Podgląd jako" role switcher is prototype-only (docs/design-handoff.md):
 * drop it in production, derive role from real M365 group membership.
 */
const Header: React.FunctionComponent<IHeaderProps> = ({ breadcrumb, role, onRoleChange, darkMode, onToggleDarkMode }) => (
  <header className={styles.header}>
    <div className={styles.breadcrumb}>{breadcrumb}</div>

    <div className={styles.searchBox}>
      <Icon name="search" size={16} className={styles.searchIcon} />
      <input
        type="search"
        className={styles.searchInput}
        placeholder="Szukaj w intranecie... (⌘K)"
        aria-label="Szukaj w intranecie"
      />
    </div>

    <div className={styles.actions}>
      <label className={styles.roleSwitcher} title="Podgląd jako (tylko w prototypie)">
        <span className={styles.roleSwitcherLabel}>Podgląd jako</span>
        <select
          value={role}
          onChange={e => onRoleChange(e.target.value as Role)}
          className={styles.roleSelect}
        >
          {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className={styles.themeToggle}
        onClick={onToggleDarkMode}
        aria-pressed={darkMode}
        aria-label={darkMode ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
        title={darkMode ? 'Tryb jasny' : 'Tryb ciemny'}
      >
        <Icon name={darkMode ? 'sun' : 'moon'} size={18} />
      </button>
    </div>
  </header>
);

export default Header;
