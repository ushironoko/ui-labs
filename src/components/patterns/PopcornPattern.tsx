import { Suspense, use } from "react";
import type { CardData } from "../../data.ts";
import { Card } from "../Card.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

function AsyncCard({ promise }: { promise: Promise<CardData> }) {
  const data = use(promise);
  return <Card data={data} />;
}

export function PopcornPattern({
  items,
}: {
  items: { card: CardData; promise: Promise<CardData> }[];
}) {
  return (
    <div className="grid">
      {items.map(({ card, promise }) => (
        <Suspense key={card.id} fallback={<SkeletonCard />}>
          <AsyncCard promise={promise} />
        </Suspense>
      ))}
    </div>
  );
}
