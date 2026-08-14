import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import PageHeader from '../../components/PageHeader/PageHeader';
import Spinner from '../../components/Spinner/Spinner';
import TextArea from '../../components/TextArea/TextArea';
import { fadeUp } from '../../lib/motion';
import { useFinalDraft } from '../../hooks/useFinalDraft';
import styles from './FinalDraftPage.module.css';

function FinalDraftPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    saveDraft,
    saveStatus,
    saveError,
    finalize,
    finalizeStatus,
    finalizeError,
    finalizeResult,
  } = useFinalDraft();

  const [text, setText] = useState('');

  useEffect(() => {
    if (typeof data?.text === 'string') {
      setText(data.text);
    }
  }, [data]);

  const onSave = (event) => {
    event.preventDefault();
    saveDraft(text);
  };

  const onFinalize = () => {
    const confirmed = window.confirm(
      'Finalize draft and commit changes? This action writes a commit and triggers graph rebuild.',
    );

    if (confirmed) {
      finalize();
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <PageHeader
          eyebrow="Draft"
          title="Final Draft Review"
          description="Edit consolidated policy text and finalize when ready to commit."
        />
        <Link className={styles.historyLink} to="/review/history">
          View version history →
        </Link>
      </div>

      {isLoading ? (
        <Card>
          <Spinner label="Loading final draft..." />
        </Card>
      ) : null}

      {isError ? (
        <Card>
          <p className={styles.error}>{error?.message || 'Failed to load final draft.'}</p>
        </Card>
      ) : null}

      {!isLoading && !isError ? (
        <Card title="Editable Policy Draft">
          <form className={styles.form} onSubmit={onSave}>
            <TextArea
              id="final-draft-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={24}
              mono
            />

            <div className={styles.actions}>
              <Button type="submit" variant="secondary" isLoading={saveStatus === 'pending'}>
                Save Edits
              </Button>
              <Button
                type="button"
                variant="primary"
                isLoading={finalizeStatus === 'pending'}
                onClick={onFinalize}
              >
                Finalize
              </Button>
            </div>

            {saveError ? <p className={styles.error}>{saveError.message}</p> : null}
            {finalizeError ? <p className={styles.error}>{finalizeError.message}</p> : null}

            {saveStatus === 'success' ? (
              <p className={styles.success}>Draft saved successfully.</p>
            ) : null}
          </form>
        </Card>
      ) : null}

      <AnimatePresence>
        {finalizeResult ? (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
            <Card title="Finalize Result">
              <div className={styles.finalizeSummary}>
                <p>Status: {finalizeResult.status || 'n/a'}</p>
                <p>Commit: {finalizeResult.commit || 'n/a'}</p>
                <p>Message: {finalizeResult.message || 'n/a'}</p>
                <p>
                  Graph Rebuild:{' '}
                  {typeof finalizeResult.graph_rebuild === 'object'
                    ? JSON.stringify(finalizeResult.graph_rebuild)
                    : String(finalizeResult.graph_rebuild || 'n/a')}
                </p>
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default FinalDraftPage;
