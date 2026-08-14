import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';
import Card from '../Card/Card';
import TextArea from '../TextArea/TextArea';
import styles from './SuggestionCard.module.css';

function SuggestionCard({ suggestion, onAccept, onReject, onEdit, isUpdating }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(suggestion.final_text || suggestion.suggested_text || '');

  const isResolved = suggestion.status === 'accepted' || suggestion.status === 'rejected';

  const operationLabel = useMemo(() => {
    if (suggestion.operation === 'insert_after') {
      return 'Insert after anchor text';
    }
    return 'Replace anchor text';
  }, [suggestion.operation]);

  const handleSubmitEdit = (event) => {
    event.preventDefault();
    onEdit(editValue);
    setIsEditing(false);
  };

  return (
    <Card>
      <article className={`${styles.cardBody} ${isResolved ? styles.resolved : ''}`}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{suggestion.gap_title}</h3>
          <div className={styles.badges}>
            <Badge value={suggestion.severity} kind="severity" />
            <Badge value={suggestion.status} kind="status" />
          </div>
        </div>

        <p className={styles.meta}>Operation: {operationLabel}</p>
        <p className={styles.rationale}>{suggestion.rationale || 'No rationale provided.'}</p>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Anchor Excerpt</h4>
          <p className={`${styles.blockText} ${suggestion.operation === 'replace' ? styles.removeText : styles.neutralText}`}>
            {suggestion.anchor_excerpt || 'No anchor excerpt provided.'}
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Proposed Text</h4>
          <p className={`${styles.blockText} ${styles.addText}`}>
            {suggestion.suggested_text || 'No suggested text provided.'}
          </p>
        </div>

        {isEditing ? (
          <form className={styles.editForm} onSubmit={handleSubmitEdit}>
            <TextArea
              id={`edit-${suggestion.id}`}
              label="Edit final text"
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
              rows={8}
            />
            <div className={styles.actions}>
              <Button type="submit" variant="primary" isLoading={isUpdating}>
                Save Edit
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles.actions}>
            <Button variant="primary" isLoading={isUpdating} onClick={onAccept}>
              Accept
            </Button>
            <Button variant="danger" isLoading={isUpdating} onClick={onReject}>
              Reject
            </Button>
            <Button variant="secondary" onClick={() => setIsEditing(true)} disabled={isUpdating}>
              Edit
            </Button>
          </div>
        )}
      </article>
    </Card>
  );
}

SuggestionCard.propTypes = {
  suggestion: PropTypes.shape({
    id: PropTypes.string.isRequired,
    gap_title: PropTypes.string,
    severity: PropTypes.string,
    operation: PropTypes.string,
    anchor_excerpt: PropTypes.string,
    suggested_text: PropTypes.string,
    final_text: PropTypes.string,
    rationale: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
};

export default SuggestionCard;
