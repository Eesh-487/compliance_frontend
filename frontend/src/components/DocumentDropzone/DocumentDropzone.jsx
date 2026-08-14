import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import styles from './DocumentDropzone.module.css';

function DocumentDropzone({ upload, onUploaded }) {
  const [file, setFile] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    const result = await upload.mutateAsync(file);
    setFile(null);
    onUploaded?.(result, file);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <motion.label
        className={styles.dropZone}
        htmlFor="document-upload"
        whileHover={{ scale: 1.008 }}
        transition={{ duration: 0.15 }}
      >
        <span className={styles.dropTitle}>Select a file to ingest</span>
        <span className={styles.dropSubtext}>Drag and drop or click to browse</span>
        <input
          id="document-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </motion.label>

      <p className={styles.fileName}>{file ? `Selected: ${file.name}` : 'No file selected yet.'}</p>

      <Button type="submit" variant="primary" disabled={!file} isLoading={upload.isPending}>
        Upload and Ingest
      </Button>

      {upload.isPending ? (
        <div className={styles.loading}>
          <Spinner label="Uploading and chunking document..." />
        </div>
      ) : null}

      {upload.isError ? <p className={styles.error}>{upload.error?.message}</p> : null}

      {upload.isSuccess ? (
        <motion.div className={styles.result} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p>Collection: {upload.data?.collection || 'n/a'}</p>
          <p>Document: {upload.data?.document || 'n/a'}</p>
          <p>Chunks Created: {upload.data?.chunk_count ?? 'n/a'}</p>
        </motion.div>
      ) : null}
    </form>
  );
}

DocumentDropzone.propTypes = {
  upload: PropTypes.shape({
    mutateAsync: PropTypes.func.isRequired,
    isPending: PropTypes.bool,
    isError: PropTypes.bool,
    isSuccess: PropTypes.bool,
    error: PropTypes.shape({ message: PropTypes.string }),
    data: PropTypes.object,
  }).isRequired,
  onUploaded: PropTypes.func,
};

export default DocumentDropzone;
