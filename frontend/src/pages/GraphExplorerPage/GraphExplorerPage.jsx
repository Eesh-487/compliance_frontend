import { useCallback, useEffect, useMemo, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { AnimatePresence, motion } from 'motion/react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import PageHeader from '../../components/PageHeader/PageHeader';
import Spinner from '../../components/Spinner/Spinner';
import { useGraph } from '../../hooks/useGraph';
import { EASE_OUT } from '../../lib/motion';
import styles from './GraphExplorerPage.module.css';

// Fixed categorical 8-hue set (see tokens.css). A force-directed layout can
// put any two node types next to each other, which this set isn't validated
// for past 3 slots at full "any two neighbors" strictness - the always-on
// node labels and this always-visible legend are the accepted relief channel
// (same escape hatch the palette's own contrast WARN requires), since folding
// 5 of 8 real entity types into "Other" would defeat the page's purpose.
const NODE_TYPES = [
  { type: 'Policy', token: '--color-node-policy' },
  { type: 'Regulation', token: '--color-node-regulation' },
  { type: 'Article', token: '--color-node-article' },
  { type: 'Requirement', token: '--color-node-requirement' },
  { type: 'Control', token: '--color-node-control' },
  { type: 'Department', token: '--color-node-department' },
  { type: 'Risk', token: '--color-node-risk' },
  { type: 'Process', token: '--color-node-process' },
];

const FALLBACK_NODE_COLOR = '#8a8778';
const EDGE_LABEL_ZOOM_THRESHOLD = 1.4;

function useResolvedNodeColors() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return {};
    }
    const computed = getComputedStyle(document.documentElement);
    const map = {};
    NODE_TYPES.forEach(({ type, token }) => {
      map[type] = computed.getPropertyValue(token).trim() || FALLBACK_NODE_COLOR;
    });
    return map;
  }, []);
}

function useContainerSize() {
  // The observed element is conditionally rendered (only once data has
  // loaded), so a plain useRef + useEffect([]) would fire before the node
  // exists and never re-run once it mounts. A callback ref re-fires
  // whenever the node itself changes, including that first real mount.
  const [node, setNode] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const refCallback = useCallback((el) => setNode(el), []);

  useEffect(() => {
    if (!node) {
      return undefined;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [refCallback, size];
}

function GraphExplorerPage() {
  const { data, isLoading, isError, error } = useGraph();
  const nodeColors = useResolvedNodeColors();
  const [containerRef, size] = useContainerSize();
  const [selectedEntity, setSelectedEntity] = useState(null);

  const entities = useMemo(() => data?.entities || [], [data]);
  const relationships = useMemo(() => data?.relationships || [], [data]);

  const entityById = useMemo(() => {
    const map = new Map();
    entities.forEach((entity) => map.set(entity.id, entity));
    return map;
  }, [entities]);

  const graphData = useMemo(
    () => ({
      nodes: entities.map((entity) => ({
        id: entity.id,
        label: entity.name,
        type: entity.type,
      })),
      links: relationships.map((rel) => ({
        source: rel.source_id,
        target: rel.target_id,
        type: rel.type,
      })),
    }),
    [entities, relationships],
  );

  const neighbors = useMemo(() => {
    if (!selectedEntity) {
      return [];
    }
    return relationships
      .filter((rel) => rel.source_id === selectedEntity.id || rel.target_id === selectedEntity.id)
      .map((rel) => {
        const isSource = rel.source_id === selectedEntity.id;
        const neighbor = entityById.get(isSource ? rel.target_id : rel.source_id);
        return { relType: rel.type, direction: isSource ? 'out' : 'in', neighbor };
      })
      .filter((item) => item.neighbor);
  }, [selectedEntity, relationships, entityById]);

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Pipeline · Explorer"
        title="Graph Explorer"
        description="Read-only view of the live compliance knowledge graph built by Graph Builder — entities as nodes, relationships as edges."
      />

      {isError ? (
        <Card>
          <p className={styles.error}>{error?.message || 'Failed to load the graph.'}</p>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <Spinner label="Loading graph..." />
        </Card>
      ) : null}

      {!isLoading && !isError && entities.length === 0 ? (
        <Card>
          <p className={styles.empty}>No graph yet — run Graph Builder from the Dashboard.</p>
        </Card>
      ) : null}

      {!isLoading && !isError && entities.length > 0 ? (
        <div className={styles.explorer}>
          <div className={styles.graphContainer} ref={containerRef}>
            {size.width > 0 ? (
              <ForceGraph2D
                graphData={graphData}
                width={size.width}
                height={size.height}
                backgroundColor="rgba(0,0,0,0)"
                linkColor={() => 'rgba(82, 82, 91, 0.35)'}
                linkWidth={1}
                onNodeClick={(node) => {
                  const entity = entityById.get(node.id);
                  if (entity) {
                    setSelectedEntity(entity);
                  }
                }}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const color = nodeColors[node.type] || FALLBACK_NODE_COLOR;
                  const radius = 5;

                  ctx.beginPath();
                  ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                  ctx.fillStyle = color;
                  ctx.fill();

                  if (selectedEntity?.id === node.id) {
                    ctx.lineWidth = 1.5 / globalScale;
                    ctx.strokeStyle = '#14161a';
                    ctx.stroke();
                  }

                  const fontSize = 12 / globalScale;
                  ctx.font = `${fontSize}px Inter, sans-serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = '#14161a';
                  ctx.fillText(node.label, node.x, node.y + radius + 2);
                }}
                nodePointerAreaPaint={(node, color, ctx) => {
                  ctx.fillStyle = color;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 9, 0, 2 * Math.PI, false);
                  ctx.fill();
                }}
                linkCanvasObjectMode={() => 'after'}
                linkCanvasObject={(link, ctx, globalScale) => {
                  if (globalScale < EDGE_LABEL_ZOOM_THRESHOLD) {
                    return;
                  }
                  const start = link.source;
                  const end = link.target;
                  if (typeof start !== 'object' || typeof end !== 'object') {
                    return;
                  }

                  const midX = (start.x + end.x) / 2;
                  const midY = (start.y + end.y) / 2;

                  ctx.font = '3.5px Inter, sans-serif';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = '#8a8778';
                  ctx.fillText(link.type || '', midX, midY);
                }}
              />
            ) : null}

            <div className={styles.legend}>
              {NODE_TYPES.map(({ type, token }) => (
                <div key={type} className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ background: `var(${token})` }} />
                  {type}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedEntity ? (
              <motion.div
                className={styles.panelWrap}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              >
                <Card
                  title={selectedEntity.name}
                  actions={
                    <Button variant="ghost" size="sm" onClick={() => setSelectedEntity(null)}>
                      Close
                    </Button>
                  }
                >
                  <div className={styles.panelBody}>
                    <span className={styles.typeBadge} style={{ background: `var(${NODE_TYPES.find((n) => n.type === selectedEntity.type)?.token || ''})` }}>
                      {selectedEntity.type}
                    </span>

                    <p className={styles.description}>
                      {selectedEntity.description || 'No description provided.'}
                    </p>

                    {selectedEntity.source_excerpt ? (
                      <div>
                        <p className={styles.sectionTitle}>Source Excerpt</p>
                        <pre className={styles.sourceExcerpt}>{selectedEntity.source_excerpt}</pre>
                      </div>
                    ) : null}

                    <div>
                      <p className={styles.sectionTitle}>Relationships ({neighbors.length})</p>
                      {neighbors.length === 0 ? (
                        <p className={styles.empty}>No direct relationships.</p>
                      ) : (
                        <ul className={styles.relationshipList}>
                          {neighbors.map(({ relType, direction, neighbor }, index) => (
                            <li key={`${relType}-${neighbor.id}-${index}`}>
                              <button
                                type="button"
                                className={styles.relationshipItem}
                                onClick={() => setSelectedEntity(neighbor)}
                              >
                                <span className={styles.relType}>
                                  {direction === 'out' ? '→' : '←'} {relType}
                                </span>
                                <span className={styles.relName}>{neighbor.name}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
    </section>
  );
}

export default GraphExplorerPage;
