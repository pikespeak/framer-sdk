import type { ItemListPayloadItem } from "../types";

export interface ItemListProps {
  items: ItemListPayloadItem[];
  className?: string;
  style?: React.CSSProperties;
  /** Custom render function per item. Falls back to the default layout. */
  renderItem?: (item: ItemListPayloadItem, index: number) => React.ReactNode;
}

/**
 * Display a list of items.
 *
 * Uses inline styles + CSS custom properties (`--gp-*`) for theming.
 * No external CSS required — safe for Framer Code Overrides.
 */
export function ItemList({ items, className, style, renderItem }: ItemListProps) {
  return (
    <ul
      className={className}
      style={{
        fontFamily: "var(--gp-font-family, inherit)",
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: "var(--gp-list-gap, 8px)",
        ...style,
      }}
    >
      {items.map((item, i) => (
        <li key={i}>
          {renderItem ? (
            renderItem(item, i)
          ) : (
            <DefaultItem item={item} />
          )}
        </li>
      ))}
    </ul>
  );
}

function DefaultItem({ item }: { item: ItemListPayloadItem }) {
  return (
    <div
      style={{
        padding: "var(--gp-item-padding, 12px)",
        borderRadius: "var(--gp-card-radius, 8px)",
        backgroundColor: "var(--gp-item-bg, transparent)",
        color: "var(--gp-card-color, inherit)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {item.image && (
        <img
          src={item.image}
          alt=""
          style={{
            width: "var(--gp-image-size, 40px)",
            height: "var(--gp-image-size, 40px)",
            objectFit: "cover",
            borderRadius: "var(--gp-image-radius, 4px)",
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "var(--gp-title-size, 0.875rem)",
            fontWeight: 500,
          }}
        >
          {item.title}
        </div>

        {item.description && (
          <div
            style={{
              fontSize: "var(--gp-description-size, 0.8125rem)",
              opacity: 0.7,
              marginTop: "2px",
            }}
          >
            {item.description}
          </div>
        )}
      </div>

      {item.value != null && (
        <span
          style={{
            fontSize: "var(--gp-value-size, 0.875rem)",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {item.value}
          {item.unit && (
            <span style={{ opacity: 0.7, marginLeft: "2px" }}>
              {item.unit}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
