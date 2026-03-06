import { motion } from "motion/react";
import { Suspense, use } from "react";
import type { CardData } from "../../data.ts";
import { Card } from "../Card.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

function FadeCard({ promise }: { promise: Promise<CardData> }) {
  const data = use(promise);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card data={data} />
    </motion.div>
  );
}

export function FadePattern({
  items,
}: {
  items: { card: CardData; promise: Promise<CardData> }[];
}) {
  return (
    <div className="grid">
      {items.map(({ card, promise }) => (
        <Suspense key={card.id} fallback={<SkeletonCard />}>
          <FadeCard promise={promise} />
        </Suspense>
      ))}
    </div>
  );
}
