import * as React from 'react';
import Icon from '../../design/Icon';
import { NAV, INavItem } from '../../design/navigation';
import logoUrl from '../../assets/logo-property-group.png';
import styles from './Sidebar.module.scss';

export interface ISidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const Sidebar: React.FunctionComponent<ISidebarProps> = ({ activeRoute, onNavigate }) => {
  const isChildActive = (item: INavItem): boolean =>
    !!item.children && item.children.some(c => c.id === activeRoute);

  const [openGroup, setOpenGroup] = React.useState<string | undefined>(() => {
    const active = NAV.filter(isChildActive)[0];
    return active ? active.id : undefined;
  });

  return (
    <nav className={styles.sidebar} aria-label="Nawigacja główna">
      <div className={styles.logo}>
        <img src={logoUrl} alt="Property Group" className={styles.logoImage} />
      </div>
      <ul className={styles.navList}>
        {NAV.map(item => {
          const hasChildren = !!item.children && item.children.length > 0;
          const active = item.id === activeRoute || isChildActive(item);
          const expanded = hasChildren && (openGroup === item.id || isChildActive(item));

          return (
            <li key={item.id} className={styles.navItem}>
              <button
                type="button"
                className={`${styles.navButton} ${active ? styles.navButtonActive : ''}`}
                onClick={() => {
                  if (hasChildren) {
                    setOpenGroup(openGroup === item.id ? undefined : item.id);
                  } else {
                    onNavigate(item.id);
                  }
                }}
                aria-expanded={hasChildren ? expanded : undefined}
              >
                <Icon name={item.icon} size={18} className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
                {hasChildren && (
                  <Icon
                    name="chevronDown"
                    size={14}
                    className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
                  />
                )}
              </button>
              {hasChildren && expanded && (
                <ul className={styles.subList}>
                  {(item.children || []).map(child => (
                    <li key={child.id}>
                      <button
                        type="button"
                        className={`${styles.subButton} ${child.id === activeRoute ? styles.subButtonActive : ''}`}
                        onClick={() => onNavigate(child.id)}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
