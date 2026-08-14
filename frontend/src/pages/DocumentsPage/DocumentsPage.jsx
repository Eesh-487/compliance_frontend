import Card from '../../components/Card/Card';
import DocumentDropzone from '../../components/DocumentDropzone/DocumentDropzone';
import PageHeader from '../../components/PageHeader/PageHeader';
import { usePipelineRun } from '../../hooks/usePipelineRun';
import styles from './DocumentsPage.module.css';

function DocumentsPage() {
  const { uploadDocument } = usePipelineRun();

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Pipeline · Manual"
        title="Policy Document Ingestion"
        description="Upload policy files in PDF, DOC, DOCX, TXT, or Markdown format. Useful for re-ingesting a single document outside the guided review flow."
      />

      <Card title="Upload Document">
        <DocumentDropzone upload={uploadDocument} />
      </Card>
    </section>
  );
}

export default DocumentsPage;
