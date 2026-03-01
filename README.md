# Data Bridge Framer SDK

Fetch and display live data from [Data Bridge](https://databridge.dev) endpoints in Framer sites and React apps.

> **Status:** Pre-release (`private: true`). Not yet published to npm.

## Features

- **`fetchEndpoint()`** — typed fetch for Data Bridge public endpoints
- **`useDataBridge()`** — React hook with polling, abort cleanup, and conditional fetching
- **`<MetricCard />`** — display a single metric value
- **`<ItemList />`** — display a list of items
- **`<DataBridge />`** — smart auto-renderer that picks the right component

Zero runtime dependencies. Only `react >= 18` as a peer dependency.

## Install

```bash
npm install databridge-framer
```

## Quick Start

### React App

```tsx
import { useDataBridge, DataBridge } from "databridge-framer";

function WeatherWidget() {
  const { data, loading, error } = useDataBridge("my-endpoint", {
    refreshInterval: 60_000,
  });

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return null;

  return <DataBridge response={data} />;
}
```

### Framer Code Override

```tsx
import { Override } from "framer";
import { useDataBridge } from "databridge-framer";

export function withLiveData(): Override {
  const { data } = useDataBridge("my-endpoint");
  if (!data) return {};

  const d = data.data as { value: string | number; unit?: string };
  return { text: `${d.value}${d.unit ? " " + d.unit : ""}` };
}
```

## API

### `fetchEndpoint(slug, options?)`

Fetch a public endpoint and return the typed `PublicEndpointResponse`.

```ts
const data = await fetchEndpoint("my-endpoint");
```

Options: `baseUrl`, `signal` (AbortSignal).

### `fetchRaw(slug, options?)`

Returns the raw `Response` for advanced use cases (headers, streaming).

### `useDataBridge(slug, options?)`

React hook that returns `{ data, loading, error, refresh }`.

Options:
- `baseUrl` — override the API base URL
- `refreshInterval` — polling interval in ms (0 = no polling)
- `enabled` — set to `false` to skip fetching

### `<MetricCard data={payload} />`

Renders a single metric. Accepts `className` and `style` props.

### `<ItemList items={items} />`

Renders a list of items. Supports a `renderItem` prop for custom rendering.

### `<DataBridge response={response} />`

Auto-renders based on `response.meta.template`.

## Theming

Components use CSS custom properties with `--db-*` prefix:

```css
.my-container {
  --db-font-family: "Inter", sans-serif;
  --db-card-padding: 20px;
  --db-card-radius: 12px;
  --db-card-bg: #f9f9f9;
  --db-card-color: #111;
  --db-value-size: 2rem;
  --db-value-weight: 700;
  --db-title-size: 0.9rem;
  --db-list-gap: 12px;
  --db-item-padding: 16px;
  --db-item-bg: #fff;
  --db-image-size: 48px;
  --db-image-radius: 8px;
}
```

## Development

```bash
npm install
npm run build       # ESM + CJS + .d.ts
npm run dev         # watch mode
npm test            # run tests
npm run typecheck   # TypeScript checks
```

## License

[MIT](./LICENSE)
