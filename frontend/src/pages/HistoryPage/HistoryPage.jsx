import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import DiffLine from '../../components/DiffLine/DiffLine';
import PageHeader from '../../components/PageHeader/PageHeader';
import Spinner from '../../components/Spinner/Spinner';
import { scrollReveal, scrollStagger } from '../../lib/motion';
import {
  useRemediationDiff,
  useRemediationHistory,
} from '../../hooks/useRemediationHistory';
import styles from './HistoryPage.module.css';

function HistoryPage() {
  const { data, isLoading, isError, error } = useRemediationHistory(20);
  const diffMutation = useRemediationDiff();
  const [fromRev, setFromRev] = useState('');
  const [toRev, setToRev] = useState('HEAD');

  const historyItems = data || [];

  const diffLines = useMemo(() => {
    const text = diffMutation.data?.diff || '';
    return text ? text.split('\n') : [];
  }, [diffMutation.data]);

  const onFetchDiff = async (event) => {
    event.preventDefault();
    if (!fromRev) {
      return;
    }

    await diffMutation.mutateAsync({ fromRev, toRev });
  };

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Audit Trail"
        title="Remediation History"
        description="Browse prior commits and compare revisions using backend diff output."
      />

      <div className={styles.grid}>
        <Card title="Recent Commits">
          {isLoading ? <Spinner label="Loading history..." /> : null}
          {isError ? <p className={styles.error}>{error?.message || 'Failed to load history.'}</p> : null}

          {!isLoading && !isError && historyItems.length === 0 ? (
            <p className={styles.empty}>No finalized remediation commits yet.</p>
          ) : null}

          <motion.ul
            className={styles.historyList}
            variants={scrollStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {historyItems.map((item) => (
              <motion.li key={item.commit} layout variants={scrollReveal}>
                <button
                  type="button"
                  className={styles.commitButton}
                  onClick={() => setFromRev(item.commit)}
                >
                  <span className={styles.commitHash}>{item.commit?.slice(0, 8)}</span>
                  <span className={styles.commitDate}>{item.date}</span>
                  <span className={styles.commitMessage}>{item.message}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </Card>

        <Card title="Compare Revisions">
          <form className={styles.diffForm} onSubmit={onFetchDiff}>
            <label htmlFor="from-rev">From revision</label>
            <input
              id="from-rev"
              value={fromRev}
              onChange={(event) => setFromRev(event.target.value)}
              placeholder="Select a commit or paste hash"
            />

            <label htmlFor="to-rev">To revision</label>
            <input
              id="to-rev"
              value={toRev}
              onChange={(event) => setToRev(event.target.value)}
              placeholder="HEAD"
            />

            <Button type="submit" variant="primary" isLoading={diffMutation.isPending}>
              Load Diff
            </Button>
          </form>

          {diffMutation.isError ? (
            <p className={styles.error}>{diffMutation.error?.message || 'Failed to load diff.'}</p>
          ) : null}

          {diffMutation.isSuccess && diffLines.length === 0 ? (
            <p className={styles.empty}>No diff output for selected revisions.</p>
          ) : null}

          {diffLines.length > 0 ? (
            <div className={styles.diffViewer}>
              {diffLines.map((line, index) => (
                <DiffLine key={`${line}-${index}`} line={line} />
              ))}
            </div>
          ) : null}
        </Card>
      </div>
    </section>
  );
}

export default HistoryPage;
