import { useShowcaseItems } from './hooks/useShowcaseItems';
import { ShowcaseCard } from './components/ShowcaseCard';
import './App.css';

export default function App() {
  const result = useShowcaseItems();
  const { usingFallback } = result;

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="logo-lockup">
            <span className="logo-mark" aria-hidden="true">PS</span>
            <div>
              <h1 className="site-title">Promet Showcase</h1>
              <p className="site-subtitle">Decoupled Drupal &middot; React &middot; TypeScript</p>
            </div>
          </div>
          
            <a
            href="https://github.com/hire-jerry-vrabel/promet-showcase"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="View source on GitHub (opens in new tab)"
          >
            <GitHubIcon />
            <span>Source</span>
          </a>
        </div>
      </header>

      <main id="main-content" className="main">
        {usingFallback && (
          <div className="fallback-banner" role="status">
            <span className="fallback-icon" aria-hidden="true">i</span>
            Displaying sample data &mdash; Drupal API not reachable from this origin.{' '}
            
              <a
              href="https://github.com/hire-jerry-vrabel/promet-showcase#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              See README (opens in new tab)
            </a>{' '}
            for setup.
          </div>
        )}

        {result.status === 'loading' && (
          <div className="loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <span>Fetching from Drupal...</span>
          </div>
        )}

        {result.status === 'success' && (
          <>
            <p className="item-count">
              {result.data.length} item{result.data.length !== 1 ? 's' : ''}
            </p>
            <ul className="card-grid" role="list">
              {result.data.map((item, i) => (
                <li key={item.id} role="listitem">
                  <ShowcaseCard item={item} index={i} />
                </li>
              ))}
            </ul>
          </>
        )}

        {result.status === 'error' && (
          <p className="error" role="alert">{result.message}</p>
        )}
      </main>

      <footer className="site-footer">
        <p>
          Built by{' '}
          
           <a href="https://linkedin.com/in/forwardslash-development"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jerry Vrabel
          </a>
          {' '}&middot; Drupal 10 + React 19 + Vite 7 &middot; Code sample for{' '}
          <a href="https://www.prometsource.com" target="_blank" rel="noopener noreferrer">
            Promet Source
          </a>
        </p>
      </footer>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
