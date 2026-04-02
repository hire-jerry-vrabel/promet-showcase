/**
 * A single Promet Showcase item as returned by the custom REST resource.
 * /api/promet-showcase → { data: ShowcaseItem[] }
 */
export interface ShowcaseItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  projectUrl: string | null;
  projectUrlTitle: string | null;
  created: number;   // Unix timestamp
  changed: number;   // Unix timestamp
  path: string;
}

/**
 * The raw API envelope from /api/promet-showcase
 */
export interface ShowcaseApiResponse {
  data: ShowcaseItem[];
}

/**
 * Loading / error / success state for data fetching.
 */
export type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
