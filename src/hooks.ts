import { useEffect, useState, useCallback, useRef } from "react";
import type { PublicEndpointResponse } from "./types";
import { fetchEndpoint } from "./fetch";

export interface UseDataBridgeOptions {
  /** Override the base URL. */
  baseUrl?: string;
  /** Polling interval in ms. 0 or undefined = no polling. */
  refreshInterval?: number;
  /** Set to false to skip fetching (conditional fetching). */
  enabled?: boolean;
}

export interface UseDataBridgeResult {
  data: PublicEndpointResponse | null;
  loading: boolean;
  error: Error | null;
  /** Manually trigger a refetch. */
  refresh: () => void;
}

/**
 * React hook for fetching data from a public Data Bridge endpoint.
 *
 * Works in Framer Code Overrides and standard React apps.
 */
export function useDataBridge(
  slug: string,
  options?: UseDataBridgeOptions,
): UseDataBridgeResult {
  const { baseUrl, refreshInterval = 0, enabled = true } = options ?? {};

  const [data, setData] = useState<PublicEndpointResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track the latest slug/baseUrl to avoid stale closures
  const slugRef = useRef(slug);
  const baseUrlRef = useRef(baseUrl);
  slugRef.current = slug;
  baseUrlRef.current = baseUrl;

  // Monotonic counter to discard out-of-order responses
  const fetchIdRef = useRef(0);

  const doFetch = useCallback(
    (signal?: AbortSignal) => {
      const id = ++fetchIdRef.current;
      setLoading(true);
      setError(null);

      fetchEndpoint(slugRef.current, {
        baseUrl: baseUrlRef.current,
        signal,
      })
        .then((res) => {
          if (id === fetchIdRef.current) {
            setData(res);
            setLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (id === fetchIdRef.current) {
            if (err instanceof DOMException && err.name === "AbortError") {
              return;
            }
            setError(
              err instanceof Error ? err : new Error(String(err)),
            );
            setLoading(false);
          }
        });
    },
    [],
  );

  // Initial fetch + polling
  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    doFetch(controller.signal);

    let timer: ReturnType<typeof setInterval> | undefined;
    if (refreshInterval > 0) {
      timer = setInterval(() => doFetch(controller.signal), refreshInterval);
    }

    return () => {
      controller.abort();
      if (timer) clearInterval(timer);
    };
  }, [slug, baseUrl, refreshInterval, enabled, doFetch]);

  const refresh = useCallback(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, error, refresh };
}
