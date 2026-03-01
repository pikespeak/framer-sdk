import type { PublicEndpointResponse } from "./types";

const DEFAULT_BASE_URL = "https://app.glosspipe.com";

export interface FetchOptions {
  /** Override the base URL (defaults to https://app.glosspipe.com). */
  baseUrl?: string;
  /** AbortSignal for cancellation. */
  signal?: AbortSignal;
}

/**
 * Fetch a public GlossPipe endpoint and return the typed response.
 *
 * Throws on non-2xx status codes.
 */
export async function fetchEndpoint(
  slug: string,
  options?: FetchOptions,
): Promise<PublicEndpointResponse> {
  const res = await fetchRaw(slug, options);

  if (!res.ok) {
    throw new Error(
      `fetchEndpoint "${slug}" failed: ${res.status} ${res.statusText}`,
    );
  }

  return res.json() as Promise<PublicEndpointResponse>;
}

/**
 * Fetch a public GlossPipe endpoint and return the raw Response.
 *
 * Useful when callers need access to headers, status, or streaming.
 */
export async function fetchRaw(
  slug: string,
  options?: FetchOptions,
): Promise<Response> {
  const base = options?.baseUrl ?? DEFAULT_BASE_URL;
  const url = `${base}/api/v1/public/${encodeURIComponent(slug)}`;

  return fetch(url, { signal: options?.signal });
}
