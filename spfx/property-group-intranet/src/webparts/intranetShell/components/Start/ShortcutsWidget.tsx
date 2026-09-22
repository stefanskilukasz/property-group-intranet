import * as React from 'react';
import Icon from '../../design/Icon';
import { IShortcutDef } from '../../data/startTypes';
import styles from './ShortcutsWidget.module.scss';

const STORAGE_KEY = 'pg-intranet-shortcuts';
const MAX_SHORTCUTS = 5;

function loadShortcutKeys(defaultKeys: string[]): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // localStorage unavailable (private browsing, blocked cookies) — fall through to default
  }
  return defaultKeys;
}

function saveShortcutKeys(keys: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // best-effort only
  }
}

export interface IShortcutsWidgetProps {
  catalog: IShortcutDef[];
  defaultKeys: string[];
  onNavigate: (route: string) => void;
}

/**
 * "Twoje skróty": user-editable, up to 5, persisted to localStorage —
 * per docs/design-handoff.md. localStorage is a per-viewer convenience
 * here (matches the prototype), not shared state.
 */
const ShortcutsWidget: React.FunctionComponent<IShortcutsWidgetProps> = ({ catalog, defaultKeys, onNavigate }) => {
  const [keys, setKeys] = React.useState<string[]>(() => loadShortcutKeys(defaultKeys));
  const [editing, setEditing] = React.useState(false);

  const byKey = React.useMemo(() => {
    const map: Record<string, IShortcutDef> = {};
    catalog.forEach(c => { map[c.key] = c; });
    return map;
  }, [catalog]);

  const toggle = (key: string): void => {
    setKeys(prev => {
      const next = prev.includes(key)
        ? prev.filter(k => k !== key)
        : prev.length < MAX_SHORTCUTS ? [...prev, key] : prev;
      saveShortcutKeys(next);
      return next;
    });
  };

  const openShortcut = (def: IShortcutDef): void => {
    if (def.to) {
      onNavigate(def.to);
    } else if (def.href) {
      window.open(def.href, '_blank', 'noreferrer');
    }
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>Twoje skróty</h3>
        <button type="button" className={styles.editButton} onClick={() => setEditing(v => !v)}>
          {editing ? 'Gotowe' : 'Edytuj'}
        </button>
      </div>

      {!editing && (
        <div className={styles.grid}>
          {keys.map(k => byKey[k]).filter(Boolean).map(def => (
            <button key={def.key} type="button" className={styles.shortcut} onClick={() => openShortcut(def)}>
              {def.label}
            </button>
          ))}
          {keys.length === 0 && <p className={styles.empty}>Brak skrótów — kliknij &quot;Edytuj&quot;, żeby dodać.</p>}
        </div>
      )}

      {editing && (
        <div className={styles.editList}>
          <p className={styles.hint}>Wybierz maksymalnie {MAX_SHORTCUTS} skrótów ({keys.length}/{MAX_SHORTCUTS}).</p>
          {catalog.map(def => {
            const checked = keys.includes(def.key);
            const disabled = !checked && keys.length >= MAX_SHORTCUTS;
            return (
              <label key={def.key} className={`${styles.editRow} ${disabled ? styles.editRowDisabled : ''}`}>
                <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(def.key)} />
                <span>{def.label}</span>
                {checked && <Icon name="close" size={12} className={styles.removeIcon} />}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShortcutsWidget;
