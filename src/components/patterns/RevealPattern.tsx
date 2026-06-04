import { motion } from "motion/react";
import { Suspense, use } from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { Card } from "../Card.tsx";
import { NestedCard } from "../NestedCard.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

function RevealCard({
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
      initial={{
        clipPath: "inset(50% round 14px)",
        filter: "blur(8px)",
      }}
      animate={{
        clipPath: "inset(0% round 14px)",
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {content}
    </motion.div>
  );
}

export function RevealPattern({ items, nested, randomize }: PatternProps) {
  return (
    <div className="grid">
      {items.map(({ card, promise }) => (
        <Suspense key={card.id} fallback={<SkeletonCard />}>
          <RevealCard promise={promise} nested={nested} randomize={randomize} />
        </Suspense>
      ))}
    </div>
  );
}
