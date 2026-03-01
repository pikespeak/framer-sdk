import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchEndpoint, fetchRaw } from "../fetch";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const MOCK_RESPONSE = {
  meta: {
    template: "metric_card" as const,
    generatedAt: "2026-03-01T00:00:00Z",
    cacheStatus: "hit" as const,
  },
  data: { title: "Temperature", value: 22, unit: "°C" },
};

describe("fetchEndpoint", () => {
  it("returns typed response on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_RESPONSE),
    });

    const result = await fetchEndpoint("demo-weather");

    expect(result).toEqual(MOCK_RESPONSE);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://app.databridge.dev/api/v1/public/demo-weather",
      { signal: undefined },
    );
  });

  it("uses custom baseUrl", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_RESPONSE),
    });

    await fetchEndpoint("test-slug", { baseUrl: "https://custom.example.com" });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://custom.example.com/api/v1/public/test-slug",
      { signal: undefined },
    );
  });

  it("throws on non-2xx status", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(fetchEndpoint("missing")).rejects.toThrow(
      'fetchEndpoint "missing" failed: 404 Not Found',
    );
  });

  it("encodes the slug in the URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_RESPONSE),
    });

    await fetchEndpoint("slug with spaces");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://app.databridge.dev/api/v1/public/slug%20with%20spaces",
      { signal: undefined },
    );
  });

  it("passes AbortSignal through", async () => {
    const controller = new AbortController();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_RESPONSE),
    });

    await fetchEndpoint("test", { signal: controller.signal });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://app.databridge.dev/api/v1/public/test",
      { signal: controller.signal },
    );
  });
});

describe("fetchRaw", () => {
  it("returns raw Response object", async () => {
    const fakeResponse = { ok: true, status: 200 };
    mockFetch.mockResolvedValueOnce(fakeResponse);

    const result = await fetchRaw("test");

    expect(result).toBe(fakeResponse);
  });
});
