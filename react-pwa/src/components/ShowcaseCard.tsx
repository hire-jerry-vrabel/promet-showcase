import type { ShowcaseItem } from '../types/showcase';
import styles from './ShowcaseCard.module.css';

interface Props {
  item: ShowcaseItem;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Architecture: '#e8f4fd',
  CMS:          '#fdf3e8',
  'Front-End':  '#edf8f0',
  PWA:          '#f3eafd',
};

function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function ShowcaseCard({ item, index }: Props) {
  const bgColor = CATEGORY_COLORS[item.category] ?? '#f0f0f0';
  const titleId = `card-title-${item.id}`;

  return (
    <article
      className={styles.card}
      aria-labelledby={titleId}
      style={{
        animationDelay: `${index * 80}ms`,
        '--category-bg': bgColor,
      } as React.CSSProperties}
    >
      <header className={styles.header}>
        {item.category && (
          <span className={styles.category}>{item.category}</span>
        )}
        <time
          className={styles.date}
          dateTime={new Date(item.created * 1000).toISOString()}
        >
          {formatDate(item.created)}
        </time>
      </header>

      <h2 id={titleId} className={styles.title}>{item.title}</h2>
      <p className={styles.summary}>{item.summary}</p>

      {item.projectUrl && (
        <footer className={styles.footer}>
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label={`${item.projectUrlTitle ?? 'View Project'} (opens in new tab)`}
          >
            <span aria-hidden="true">{item.projectUrlTitle ?? 'View Project'}</span>
            <span aria-hidden="true" className={styles.arrow}>{'→'}</span>
          </a>
        </footer>
      )}
    </article>
  );
}
