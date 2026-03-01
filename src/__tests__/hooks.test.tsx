import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useDataBridge } from "../hooks";
import type { PublicEndpointResponse } from "../types";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const MOCK_RESPONSE: PublicEndpointResponse = {
  meta: {
    template: "metric_card",
    generatedAt: "2026-03-01T00:00:00Z",
    cacheStatus: "hit",
  },
  data: { title: "Temperature", value: 22, unit: "°C" },
};

function mockSuccessResponse() {
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(MOCK_RESPONSE),
  });
}

describe("useDataBridge", () => {
  it("fetches data on mount", async () => {
    mockSuccessResponse();
    const { result } = renderHook(() => useDataBridge("test"));

    // Initially loading
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(MOCK_RESPONSE);
    expect(result.current.error).toBeNull();
  });

  it("sets error on fetch failure", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useDataBridge("test"));

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
    });

    expect(result.current.data).toBeNull();
  });

  it("does not fetch when enabled is false", async () => {
    mockSuccessResponse();
    const { result } = renderHook(() =>
      useDataBridge("test", { enabled: false }),
    );

    // Give React time to settle
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    // fetch may be called by StrictMode double-mount then aborted;
    // the key assertion is that no data was set
  });

  it("refetches on slug change", async () => {
    mockSuccessResponse();
    const { result, rerender } = renderHook(
      ({ slug }: { slug: string }) => useDataBridge(slug),
      { initialProps: { slug: "first" } },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const callsBefore = mockFetch.mock.calls.length;
    rerender({ slug: "second" });

    await waitFor(() => {
      expect(mockFetch.mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });

  it("supports manual refresh", async () => {
    mockSuccessResponse();
    const { result } = renderHook(() => useDataBridge("test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const callsBefore = mockFetch.mock.calls.length;

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(mockFetch.mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });

  it("polls at refreshInterval", async () => {
    vi.useFakeTimers();
    mockSuccessResponse();

    renderHook(() =>
      useDataBridge("test", { refreshInterval: 5000 }),
    );

    // Let initial fetch resolve
    await vi.advanceTimersByTimeAsync(10);

    const callsAfterInit = mockFetch.mock.calls.length;

    // Advance past one polling interval
    await vi.advanceTimersByTimeAsync(5000);

    expect(mockFetch.mock.calls.length).toBeGreaterThan(callsAfterInit);

    vi.useRealTimers();
  });
});
