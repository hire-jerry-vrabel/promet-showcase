import { useEffect, useState } from 'react';
import type { FetchState, ShowcaseItem } from '../types/showcase';
import { FIXTURE_ITEMS } from '../data/fixtures';

const API_BASE = import.meta.env.VITE_DRUPAL_BASE_URL ?? '';
const ENDPOINT = `${API_BASE}/jsonapi/node/promet_showcase?sort=-created`;
const TIMEOUT_MS = 6_000;

/**
 * Fetches Promet Showcase items from the Drupal JSON:API endpoint.
 *
 * Strategy:
 *  1. Attempt live fetch from VITE_DRUPAL_BASE_URL/jsonapi/node/promet_showcase
 *  2. On network error, CORS failure, non-2xx, or timeout → fall back to
 *     fixture data and surface a non-blocking banner to the user.
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
          headers: { Accept: 'application/vnd.api+json' },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const raw = Array.isArray(json?.data) ? json.data : [];

        // Normalise JSON:API envelope → flat ShowcaseItem shape
        const items: ShowcaseItem[] = raw.map((node: Record<string, unknown>) => {
          const attr = (node.attributes ?? {}) as Record<string, unknown>;
          const urlField = attr.field_showcase_url as { uri?: string; title?: string } | null;
          const pathField = attr.path as { alias?: string } | null;

          return {
            id: attr.drupal_internal__nid as number,
            title: attr.title as string,
            summary: (attr.field_showcase_summary as string) ?? '',
            category: (attr.field_showcase_category as string) ?? '',
            projectUrl: urlField?.uri ?? null,
            projectUrlTitle: urlField?.title ?? null,
            created: Math.floor(new Date(attr.created as string).getTime() / 1000),
            changed: Math.floor(new Date(attr.changed as string).getTime() / 1000),
            path: pathField?.alias ?? `/node/${attr.drupal_internal__nid}`,
          };
        });

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
