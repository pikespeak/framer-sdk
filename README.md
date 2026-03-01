# GlossPipe Framer SDK

Fetch and display live data from [GlossPipe](https://glosspipe.com) endpoints in Framer sites and React apps.

> **Status:** Pre-release (`private: true`). Not yet published to npm.

## Features

- **`fetchEndpoint()`** — typed fetch for GlossPipe public endpoints
- **`useGlossPipe()`** — React hook with polling, abort cleanup, and conditional fetching
- **`<MetricCard />`** — display a single metric value
- **`<ItemList />`** — display a list of items
- **`<GlossPipe />`** — smart auto-renderer that picks the right component

Zero runtime dependencies. Only `react >= 18` as a peer dependency.

## Install

```bash
npm install @glosspipe/framer-sdk
```

## Quick Start

### React App

```tsx
import { useGlossPipe, GlossPipe } from "@glosspipe/framer-sdk";

function WeatherWidget() {
  const { data, loading, error } = useGlossPipe("my-endpoint", {
    refreshInterval: 60_000,
  });

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return null;

  return <GlossPipe response={data} />;
}
```

### Framer Code Override

```tsx
import { Override } from "framer";
import { useGlossPipe } from "@glosspipe/framer-sdk";

export function withLiveData(): Override {
  const { data } = useGlossPipe("my-endpoint");
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

### `useGlossPipe(slug, options?)`

React hook that returns `{ data, loading, error, refresh }`.

Options:
- `baseUrl` — override the API base URL
- `refreshInterval` — polling interval in ms (0 = no polling)
- `enabled` — set to `false` to skip fetching

### `<MetricCard data={payload} />`

Renders a single metric. Accepts `className` and `style` props.

### `<ItemList items={items} />`

Renders a list of items. Supports a `renderItem` prop for custom rendering.

### `<GlossPipe response={response} />`

Auto-renders based on `response.meta.template`.

## Theming

Components use CSS custom properties with `--gp-*` prefix:

```css
.my-container {
  --gp-font-family: "Inter", sans-serif;
  --gp-card-padding: 20px;
  --gp-card-radius: 12px;
  --gp-card-bg: #f9f9f9;
  --gp-card-color: #111;
  --gp-value-size: 2rem;
  --gp-value-weight: 700;
  --gp-title-size: 0.9rem;
  --gp-list-gap: 12px;
  --gp-item-padding: 16px;
  --gp-item-bg: #fff;
  --gp-image-size: 48px;
  --gp-image-radius: 8px;
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
