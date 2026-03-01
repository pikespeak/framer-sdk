import { useDataBridge, DataBridge } from "databridge-framer";

/**
 * Minimal weather demo consuming the Data Bridge SDK.
 *
 * Replace "demo-weather" with your own endpoint slug once the
 * hosted platform is available.
 */
export function App() {
  const { data, loading, error, refresh } = useDataBridge("demo-weather", {
    refreshInterval: 60_000, // poll every 60 s
  });

  return (
    <div
      style={{
        maxWidth: 400,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
        Weather Demo
      </h1>

      {loading && !data && <p>Loading…</p>}

      {error && (
        <p style={{ color: "#dc2626" }}>
          Error: {error.message}
        </p>
      )}

      {data && <DataBridge response={data} />}

      <button
        onClick={refresh}
        style={{
          alignSelf: "flex-start",
          padding: "8px 16px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
      >
        {loading ? "Refreshing…" : "Refresh"}
      </button>

      <details style={{ fontSize: "0.8125rem", opacity: 0.7 }}>
        <summary>Framer Code Override usage</summary>
        <pre
          style={{
            marginTop: 8,
            padding: 12,
            background: "#e5e5e5",
            borderRadius: 6,
            overflow: "auto",
            fontSize: "0.75rem",
            lineHeight: 1.5,
          }}
        >{`import { Override } from "framer"
import { useDataBridge } from "databridge-framer"

export function withWeather(): Override {
  const { data } = useDataBridge("demo-weather")
  if (!data) return {}
  const d = data.data as { value: string | number; unit?: string }
  return { text: \`\${d.value}\${d.unit ? " " + d.unit : ""}\` }
}`}</pre>
      </details>
    </div>
  );
}
