import type { PublicEndpointResponse, ItemListPayloadItem } from "../types";
import { MetricCard } from "./metric-card";
import { ItemList } from "./item-list";

export interface GlossPipeProps {
  response: PublicEndpointResponse;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Smart auto-renderer that dispatches to the correct display component
 * based on `response.meta.template`.
 */
export function GlossPipe({ response, className, style }: GlossPipeProps) {
  const { template } = response.meta;

  switch (template) {
    case "metric_card":
      return (
        <MetricCard
          data={response.data as PublicEndpointResponse["data"] & { title: string; value: string | number }}
          className={className}
          style={style}
        />
      );

    case "item_list":
      return (
        <ItemList
          items={response.data as ItemListPayloadItem[]}
          className={className}
          style={style}
        />
      );

    default: {
      const _exhaustive: never = template;
      return (
        <div className={className} style={style}>
          Unknown template: {_exhaustive}
        </div>
      );
    }
  }
}
