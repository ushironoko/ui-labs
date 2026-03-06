import { Suspense, use } from "react";
import type { CardData, FieldPromises } from "../data.ts";

function FieldValue({
  promise,
  color,
}: {
  promise: Promise<string>;
  color: string;
}) {
  const value = use(promise);
  return (
    <div className="card-value" style={{ color }}>
      {value}
    </div>
  );
}

function FieldDescription({ promise }: { promise: Promise<string> }) {
  const description = use(promise);
  return <div className="card-description">{description}</div>;
}

export function NestedCard({
  data,
  fields,
}: {
  data: CardData;
  fields: FieldPromises;
}) {
  return (
    <div className="card">
      <div className="card-accent" style={{ background: data.color }} />
      <span className="card-icon">{data.icon}</span>
      <div className="card-title">{data.title}</div>
      <Suspense fallback={<div className="skeleton-line skeleton-value" />}>
        <FieldValue promise={fields.value} color={data.color} />
      </Suspense>
      <Suspense fallback={<div className="skeleton-line skeleton-desc" />}>
        <FieldDescription promise={fields.description} />
      </Suspense>
    </div>
  );
}
