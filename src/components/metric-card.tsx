import type { MetricCardPayload } from "../types";

export interface MetricCardProps {
  data: MetricCardPayload;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Display a single metric value.
 *
 * Uses inline styles + CSS custom properties (`--gp-*`) for theming.
 * No external CSS required — safe for Framer Code Overrides.
 */
export function MetricCard({ data, className, style }: MetricCardProps) {
  return (
    <div
      className={className}
      style={{
        fontFamily: "var(--gp-font-family, inherit)",
        padding: "var(--gp-card-padding, 16px)",
        borderRadius: "var(--gp-card-radius, 8px)",
        backgroundColor: "var(--gp-card-bg, transparent)",
        color: "var(--gp-card-color, inherit)",
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
            width: "var(--gp-image-size, 48px)",
            height: "var(--gp-image-size, 48px)",
            objectFit: "cover",
            borderRadius: "var(--gp-image-radius, 4px)",
          }}
        />
      )}

      <span
        style={{
          fontSize: "var(--gp-title-size, 0.875rem)",
          opacity: 0.7,
        }}
      >
        {data.title}
      </span>

      <span
        style={{
          fontSize: "var(--gp-value-size, 1.5rem)",
          fontWeight: "var(--gp-value-weight, 600)" as never,
        }}
      >
        {data.value}
        {data.unit && (
          <span
            style={{
              fontSize: "var(--gp-unit-size, 0.875rem)",
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
            fontSize: "var(--gp-date-size, 0.75rem)",
            opacity: 0.5,
          }}
        >
          {data.date}
        </span>
      )}
    </div>
  );
}
