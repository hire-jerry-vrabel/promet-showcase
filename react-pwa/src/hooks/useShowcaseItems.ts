import { useEffect, useState } from 'react';
import type { FetchState, ShowcaseItem } from '../types/showcase';
import { FIXTURE_ITEMS } from '../data/fixtures';

const API_BASE = import.meta.env.VITE_DRUPAL_BASE_URL ?? '';
const ENDPOINT = `${API_BASE}/api/promet-showcase?_format=json`;
const TIMEOUT_MS = 6_000;

/**
 * Fetches Promet Showcase items from the Drupal REST endpoint.
 *
 * Strategy:
 *  1. Attempt live fetch from VITE_DRUPAL_BASE_URL/api/promet-showcase
 *  2. On network error, CORS failure, non-2xx, or timeout → fall back to
 *     fixture data and surface a non-blocking banner to the user.
 *
 * The fallback ensures the GitHub Pages demo is always functional even
 * when the Pantheon sandbox is sleeping.
 */
export function useShowcaseItems(): FetchState<ShowcaseItem[]> & { usingFallback: boolean } {
  const [state, setState] = useState<FetchState<ShowcaseItem[]>>({ status: 'idle' });
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const load = async () => {
      setState({ status: 'loading' });

      // If no API base URL is configured, skip straight to fixtures.
      if (!API_BASE) {
        if (!cancelled) {
          setUsingFallback(true);
          setState({ status: 'success', data: FIXTURE_ITEMS });
        }
        return;
      }

      try {
        const res = await fetch(ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const items: ShowcaseItem[] = Array.isArray(json?.data) ? json.data : [];

        if (!cancelled) {
          setUsingFallback(false);
          setState({ status: 'success', data: items });
        }
      } catch {
        if (!cancelled) {
          setUsingFallback(true);
          setState({ status: 'success', data: FIXTURE_ITEMS });
        }
      } finally {
        clearTimeout(timer);
      }
    };

    load();
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  return { ...state, usingFallback };
}
