import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import CustomCursor from '../CustomCursor/CustomCursor';
import PageTransition from '../PageTransition/PageTransition';
import { EASE_OUT, SPRING_BOUNCY } from '../../lib/motion';
import styles from './Layout.module.css';

const NAV_GROUPS = [
  {
    section: null,
    items: [{ to: '/', label: 'Start Review', end: true }],
  },
  {
    section: 'Pipeline · Manual',
    items: [
      { to: '/pipeline/graph-builder', label: 'Graph Builder' },
      { to: '/pipeline/law-ingest', label: 'Law Ingest' },
      { to: '/pipeline/documents', label: 'Documents' },
      { to: '/pipeline/gap-analysis', label: 'Gap Analysis' },
      { to: '/pipeline/graph-explorer', label: 'Graph Explorer' },
    ],
  },
  {
    section: 'Review',
    items: [
      { to: '/review/suggestions', label: 'Suggestions' },
      { to: '/review/final-draft', label: 'Final Draft' },
      { to: '/review/history', label: 'History' },
    ],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

function NavIndicatorLink({ item, onClick }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId="nav-active-indicator"
              className={styles.navIndicator}
              transition={SPRING_BOUNCY}
            />
          ) : null}
          <span className={styles.navLabel}>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <CustomCursor />
      <div className="auroraLayer" aria-hidden="true" />

      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <p className={styles.overline}>Compliance Memory System</p>
          <h1 className={styles.brand}>Policy Remediation Console</h1>
        </div>

        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.section || 'root'} className={styles.navGroup}>
              {group.section ? <p className={styles.navGroupLabel}>{group.section}</p> : null}
              {group.items.map((item) => (
                <NavIndicatorLink key={item.to} item={item} />
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className={styles.mobileBar}>
        <p className={styles.mobileBrand}>Policy Remediation Console</p>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          Menu
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.nav
            id="mobile-nav"
            className={styles.mobileNav}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <main className={styles.mainContent}>
        <PageTransition />
      </main>
    </div>
  );
}

export default Layout;
