import { Suspense, use } from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { Card } from "../Card.tsx";
import { NestedCard } from "../NestedCard.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

function AsyncCard({
  promise,
  nested,
  randomize,
}: {
  promise: Promise<CardData>;
  nested: boolean;
  randomize: boolean;
}) {
  const data = use(promise);
  if (nested) {
    return (
      <NestedCard
        data={data}
        fields={getFieldPromises(data.id, data, randomize)}
      />
    );
  }
  return <Card data={data} />;
}

export function PopcornPattern({ items, nested, randomize }: PatternProps) {
  return (
    <div className="grid">
      {items.map(({ card, promise }) => (
        <Suspense key={card.id} fallback={<SkeletonCard />}>
          <AsyncCard promise={promise} nested={nested} randomize={randomize} />
        </Suspense>
      ))}
    </div>
  );
}
