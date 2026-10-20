import { motion } from 'motion/react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import PageHeader from '../../components/PageHeader/PageHeader';
import Spinner from '../../components/Spinner/Spinner';
import SuggestionCard from '../../components/SuggestionCard/SuggestionCard';
import { scrollReveal, scrollStagger } from '../../lib/motion';
import { useSuggestions } from '../../hooks/useSuggestions';
import styles from './SuggestionsPage.module.css';

function SuggestionsPage() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    updateSuggestion,
    updateStatus,
  } = useSuggestions();

  const suggestions = data || [];

  const handleUpdate = (id, payload) => {
    updateSuggestion({ id, payload });
  };

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <PageHeader
          eyebrow="Review"
          title="Suggestion Review"
          description="Review AI-drafted changes and resolve each suggestion explicitly."
        />
        <Button variant="ghost" size="sm" isLoading={isFetching} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <Spinner label="Loading remediation suggestions..." />
        </Card>
      ) : null}

      {isError ? (
        <Card>
          <p className={styles.error}>{error?.message || 'Failed to load suggestions.'}</p>
        </Card>
      ) : null}

      {!isLoading && !isError && suggestions.length === 0 ? (
        <Card>
          <p className={styles.empty}>No suggestions yet. Run a Start Compliance Review from the home page.</p>
        </Card>
      ) : null}

      {/*
        animate, not whileInView - see HistoryPage: the container renders before
        the data arrives, so a scroll trigger fires on an empty list and the
        cards that mount afterwards never animate in.
      */}
      <motion.div
        className={styles.list}
        variants={scrollStagger}
        initial="hidden"
        animate="visible"
      >
        {suggestions.map((suggestion) => (
          <motion.div key={suggestion.id} layout variants={scrollReveal}>
            <SuggestionCard
              suggestion={suggestion}
              isUpdating={updateStatus === 'pending'}
              onAccept={() => handleUpdate(suggestion.id, { status: 'accepted' })}
              onReject={() => handleUpdate(suggestion.id, { status: 'rejected' })}
              onEdit={(newText) =>
                handleUpdate(suggestion.id, {
                  status: 'edited',
                  final_text: newText,
                })
              }
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default SuggestionsPage;
