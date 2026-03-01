import type { MetricCardPayload } from "../types";

export interface MetricCardProps {
  data: MetricCardPayload;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Display a single metric value.
 *
 * Uses inline styles + CSS custom properties (`--db-*`) for theming.
 * No external CSS required — safe for Framer Code Overrides.
 */
export function MetricCard({ data, className, style }: MetricCardProps) {
  return (
    <div
      className={className}
      style={{
        fontFamily: "var(--db-font-family, inherit)",
        padding: "var(--db-card-padding, 16px)",
        borderRadius: "var(--db-card-radius, 8px)",
        backgroundColor: "var(--db-card-bg, transparent)",
        color: "var(--db-card-color, inherit)",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        ...style,
      }}
    >
      {data.image && (
        <img
          src={data.image}
          alt=""
          style={{
            width: "var(--db-image-size, 48px)",
            height: "var(--db-image-size, 48px)",
            objectFit: "cover",
            borderRadius: "var(--db-image-radius, 4px)",
          }}
        />
      )}

      <span
        style={{
          fontSize: "var(--db-title-size, 0.875rem)",
          opacity: 0.7,
        }}
      >
        {data.title}
      </span>

      <span
        style={{
          fontSize: "var(--db-value-size, 1.5rem)",
          fontWeight: "var(--db-value-weight, 600)" as never,
        }}
      >
        {data.value}
        {data.unit && (
          <span
            style={{
              fontSize: "var(--db-unit-size, 0.875rem)",
              marginLeft: "4px",
              opacity: 0.7,
            }}
          >
            {data.unit}
          </span>
        )}
      </span>

      {data.date && (
        <span
          style={{
            fontSize: "var(--db-date-size, 0.75rem)",
            opacity: 0.5,
          }}
        >
          {data.date}
        </span>
      )}
    </div>
  );
}
