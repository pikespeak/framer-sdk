/** Supported display template types. */
export type TemplateKind = "metric_card" | "item_list";

/** Payload for the metric_card template. */
export interface MetricCardPayload {
  title: string;
  value: string | number;
  unit?: string;
  image?: string;
  date?: string;
}

/** Single item in an item_list payload. */
export interface ItemListPayloadItem {
  title: string;
  description?: string;
  value?: string | number;
  unit?: string;
  image?: string;
  date?: string;
}

/** Shape returned by a public Data Bridge endpoint. */
export interface PublicEndpointResponse {
  meta: {
    template: TemplateKind;
    generatedAt: string;
    cacheStatus: "hit" | "miss" | "stale";
  };
  data: MetricCardPayload | ItemListPayloadItem[];
}
