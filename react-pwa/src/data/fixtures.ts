import type { ShowcaseItem } from '../types/showcase';

/**
 * Fallback fixture data displayed when the Drupal API is unreachable
 * (e.g. Pantheon sandbox is sleeping or CORS is not yet configured).
 *
 * These items mirror the shape of real API responses so the UI renders
 * identically in both live and fallback modes.
 */
export const FIXTURE_ITEMS: ShowcaseItem[] = [
  {
    id: 1,
    title: 'Decoupled Drupal Architecture for VA.gov',
    summary:
      'Explores the JSON:API + React pattern used across VA.gov properties, ' +
      'covering content modeling, authenticated endpoints, and incremental static ' +
      'regeneration strategies for high-traffic federal sites.',
    category: 'Architecture',
    projectUrl: 'https://www.va.gov',
    projectUrlTitle: 'VA.gov',
    created: 1_710_000_000,
    changed: 1_712_000_000,
    path: '/node/1',
  },
  {
    id: 2,
    title: 'Component-Driven CMS with Provus',
    summary:
      "A deep dive into Promet Source's Provus layout system — building reusable, " +
      'accessible section components that content editors can compose without ' +
      'developer involvement.',
    category: 'CMS',
    projectUrl: 'https://www.prometsource.com/provus',
    projectUrlTitle: 'Provus by Promet',
    created: 1_708_000_000,
    changed: 1_711_000_000,
    path: '/node/2',
  },
  {
    id: 3,
    title: 'USWDS Integration in Drupal 10 Themes',
    summary:
      'Step-by-step walkthrough of scaffolding a Drupal 10 sub-theme that consumes ' +
      'U.S. Web Design System tokens, ensuring Section 508 compliance and consistent ' +
      'federal brand identity across agency portals.',
    category: 'Front-End',
    projectUrl: null,
    projectUrlTitle: null,
    created: 1_705_000_000,
    changed: 1_709_000_000,
    path: '/node/3',
  },
  {
    id: 4,
    title: 'Progressive Web Apps on Top of Drupal JSON:API',
    summary:
      'How to layer a Vite-powered React PWA over a headless Drupal backend — ' +
      'covering service-worker caching strategies, offline fallbacks, and deployment ' +
      'to GitHub Pages via GitHub Actions.',
    category: 'PWA',
    projectUrl: 'https://hire-jerry-vrabel.github.io/promet-showcase',
    projectUrlTitle: 'Live Demo',
    created: 1_703_000_000,
    changed: 1_710_500_000,
    path: '/node/4',
  },
];
