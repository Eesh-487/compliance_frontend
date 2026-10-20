import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import PageTransition from '../PageTransition/PageTransition';
import { usePipelineRun } from '../../hooks/usePipelineRun';
import { SPRING_GLASS, fadeUp } from '../../lib/motion';
import { readPreference, setPreference } from '../../lib/theme';
import styles from './Layout.module.css';

// Line icons in one weight (1.75 stroke), sized to match the label like SF Symbols.
const ICONS = {
  start: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  builder: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.5 6h7M7.2 8.2l3.6 7.6M16.8 8.2l-3.6 7.6" />
    </>
  ),
  law: (
    <>
      <path d="M12 3v18M8 21h8M5 7h14" />
      <path d="M5 7l-3 7h6zM19 7l-3 7h6z" />
    </>
  ),
  documents: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  gaps: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4M8.5 11h5" />
    </>
  ),
  explorer: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  suggestions: (
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
  ),
  draft: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  history: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  system: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

const NAV_GROUPS = [
  {
    section: null,
    items: [{ to: '/', label: 'Start Review', icon: 'start', end: true }],
  },
  {
    section: 'Pipeline',
    items: [
      { to: '/pipeline/graph-builder', label: 'Graph Builder', icon: 'builder' },
      { to: '/pipeline/law-ingest', label: 'Law Ingest', icon: 'law' },
      { to: '/pipeline/documents', label: 'Documents', icon: 'documents' },
      { to: '/pipeline/gap-analysis', label: 'Gap Analysis', icon: 'gaps' },
      { to: '/pipeline/graph-explorer', label: 'Graph Explorer', icon: 'explorer' },
    ],
  },
  {
    section: 'Review',
    items: [
      { to: '/review/suggestions', label: 'Suggestions', icon: 'suggestions' },
      { to: '/review/final-draft', label: 'Final Draft', icon: 'draft' },
      { to: '/review/history', label: 'History', icon: 'history' },
    ],
  },
  {
    section: 'Settings',
    items: [{ to: '/settings', label: 'LLM Provider', icon: 'settings' }],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

const menuVariants = {
  hidden: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
  visible: { opacity: 1, scale: 1, transition: { ...SPRING_GLASS, staggerChildren: 0.025 } },
};

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
              transition={SPRING_GLASS}
            />
          ) : null}
          <span className={styles.navLabel}>
            <Icon name={item.icon} />
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

const APPEARANCES = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Segmented control for appearance; the selected thumb glides between options.
function AppearanceSwitch({ id }) {
  const [preference, setPref] = useState(readPreference);

  return (
    <div className={`glass ${styles.segmented}`} role="radiogroup" aria-label="Appearance">
      {APPEARANCES.map((option) => {
        const selected = preference === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            className={`${styles.segment} ${selected ? styles.segmentSelected : ''}`}
            onClick={() => {
              setPreference(option.value);
              setPref(option.value);
            }}
          >
            {selected ? (
              <motion.span
                layoutId={`appearance-thumb-${id}`}
                className={styles.segmentThumb}
                transition={SPRING_GLASS}
              />
            ) : null}
            <Icon name={option.value} />
          </button>
        );
      })}
    </div>
  );
}

// Floating glass status capsule (Live Activity–style) so a long pipeline run
// stays visible and stoppable from any page.
function PipelineCapsule() {
  const { pathname } = useLocation();
  const { orchestration } = usePipelineRun();
  const { steps, hasStarted, isRunning, isAwaitingUpload, failedStep, stop } = orchestration;

  const visible = hasStarted && pathname !== '/' && (isRunning || isAwaitingUpload || failedStep);
  const doneCount = steps.filter((step) => step.status === 'done').length;
  const current = failedStep || steps.find((s) => s.status === 'running' || s.status === 'active');
  const status = failedStep ? 'failed' : isAwaitingUpload ? 'waiting' : 'running';
  const caption = failedStep
    ? 'Needs attention'
    : isAwaitingUpload
      ? 'Waiting for your documents'
      : `Step ${doneCount + 1} of ${steps.length}`;

  return (
    <AnimatePresence>
      {visible && current ? (
        <motion.div
          className={`glass ${styles.capsule}`}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={SPRING_GLASS}
        >
          <span className={`${styles.capsuleDot} ${styles[`capsule_${status}`]}`} aria-hidden="true" />
          <Link to="/" className={styles.capsuleText}>
            <motion.span
              key={current.key}
              className={styles.capsuleTitle}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {current.label}
            </motion.span>
            <span className={styles.capsuleCaption}>{caption}</span>
          </Link>
          <span className={styles.capsuleTrack} aria-hidden="true">
            <motion.span
              className={styles.capsuleFill}
              animate={{ scaleX: doneCount / steps.length }}
              transition={SPRING_GLASS}
            />
          </span>
          {isRunning ? (
            <button type="button" className={styles.capsuleStop} onClick={stop} aria-label="Stop pipeline">
              <span aria-hidden="true" />
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className={styles.shell}>
      <aside className={`glass ${styles.sidebar}`}>
        <div className={styles.brandBlock}>
          <h1 className={styles.brand}>Policy Remediation</h1>
          <p className={styles.overline}>Compliance Memory System</p>
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

        <div className={styles.sidebarFooter}>
          <span className={styles.footerLabel}>Appearance</span>
          <AppearanceSwitch id="sidebar" />
        </div>
      </aside>

      <div className={`glass ${styles.mobileBar}`}>
        <p className={styles.mobileBrand}>Policy Remediation</p>
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
            className={`glass ${styles.mobileNav}`}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {NAV_ITEMS.map((item) => (
              <motion.div key={item.to} variants={fadeUp}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
                  }
                >
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
            <motion.div variants={fadeUp} className={styles.mobileAppearance}>
              <span className={styles.footerLabel}>Appearance</span>
              <AppearanceSwitch id="mobile" />
            </motion.div>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <main className={styles.mainContent}>
        <PageTransition />
      </main>

      <PipelineCapsule />
    </div>
  );
}

export default Layout;
