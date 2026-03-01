import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "../components/metric-card";
import { ItemList } from "../components/item-list";
import { GlossPipe } from "../components/data-bridge";
import type { PublicEndpointResponse } from "../types";

describe("MetricCard", () => {
  it("renders title and value", () => {
    render(
      <MetricCard data={{ title: "Temperature", value: 22, unit: "°C" }} />,
    );

    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();
    expect(screen.getByText("°C")).toBeInTheDocument();
  });

  it("renders without optional fields", () => {
    render(<MetricCard data={{ title: "Count", value: 42 }} />);

    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders date when provided", () => {
    render(
      <MetricCard data={{ title: "Test", value: 1, date: "2026-03-01" }} />,
    );

    expect(screen.getByText("2026-03-01")).toBeInTheDocument();
  });

  it("renders image when provided", () => {
    const { container } = render(
      <MetricCard
        data={{ title: "Test", value: 1, image: "https://example.com/img.png" }}
      />,
    );

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "https://example.com/img.png");
  });

  it("accepts className and style", () => {
    const { container } = render(
      <MetricCard
        data={{ title: "Test", value: 1 }}
        className="custom-class"
        style={{ border: "1px solid red" }}
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("custom-class");
    expect(root.style.border).toBe("1px solid red");
  });
});

describe("ItemList", () => {
  const items = [
    { title: "Item A", value: 10, unit: "kg" },
    { title: "Item B", description: "Description B" },
    { title: "Item C" },
  ];

  it("renders all items", () => {
    render(<ItemList items={items} />);

    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    expect(screen.getByText("Item C")).toBeInTheDocument();
  });

  it("renders value and unit", () => {
    render(<ItemList items={items} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
  });

  it("renders description when present", () => {
    render(<ItemList items={items} />);

    expect(screen.getByText("Description B")).toBeInTheDocument();
  });

  it("supports custom renderItem", () => {
    render(
      <ItemList
        items={items}
        renderItem={(item) => <span data-testid="custom">{item.title}!</span>}
      />,
    );

    const customItems = screen.getAllByTestId("custom");
    expect(customItems).toHaveLength(3);
    expect(customItems[0]).toHaveTextContent("Item A!");
  });
});

describe("GlossPipe", () => {
  it("renders MetricCard for metric_card template", () => {
    const response: PublicEndpointResponse = {
      meta: {
        template: "metric_card",
        generatedAt: "2026-03-01T00:00:00Z",
        cacheStatus: "hit",
      },
      data: { title: "Temp", value: 22, unit: "°C" },
    };

    render(<GlossPipe response={response} />);

    expect(screen.getByText("Temp")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();
  });

  it("renders ItemList for item_list template", () => {
    const response: PublicEndpointResponse = {
      meta: {
        template: "item_list",
        generatedAt: "2026-03-01T00:00:00Z",
        cacheStatus: "miss",
      },
      data: [{ title: "First" }, { title: "Second" }],
    };

    render(<GlossPipe response={response} />);

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
