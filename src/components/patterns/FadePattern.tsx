import { motion } from "motion/react";
import { Suspense, use } from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { Card } from "../Card.tsx";
import { NestedCard } from "../NestedCard.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

function FadeCard({
  promise,
  nested,
  randomize,
}: {
  promise: Promise<CardData>;
  nested: boolean;
  randomize: boolean;
}) {
  const data = use(promise);
  const content = nested ? (
    <NestedCard
      data={data}
      fields={getFieldPromises(data.id, data, randomize)}
    />
  ) : (
    <Card data={data} />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {content}
    </motion.div>
  );
}

export function FadePattern({ items, nested, randomize }: PatternProps) {
  return (
    <div className="grid">
      {items.map(({ card, promise }) => (
        <Suspense key={card.id} fallback={<SkeletonCard />}>
          <FadeCard promise={promise} nested={nested} randomize={randomize} />
        </Suspense>
      ))}
    </div>
  );
}
