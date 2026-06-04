import { motion, useMotionValue, useTransform } from "motion/react";
import { Suspense, use } from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { Card } from "../Card.tsx";
import { NestedCard } from "../NestedCard.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

function FlipCard({
  promise,
  nested,
  randomize,
}: {
  promise: Promise<CardData>;
  nested: boolean;
  randomize: boolean;
}) {
  const data = use(promise);
  const rotateY = useMotionValue(90);
  const brightness = useTransform(rotateY, [90, 0], [0.5, 1]);
  const shadow = useTransform(
    rotateY,
    [90, 45, 0],
    [
      "0px 0px 0px rgba(0,0,0,0)",
      "8px 8px 20px rgba(0,0,0,0.15)",
      "0px 4px 12px rgba(0,0,0,0.08)",
    ],
  );

  const content = nested ? (
    <NestedCard
      data={data}
      fields={getFieldPromises(data.id, data, randomize)}
    />
  ) : (
    <Card data={data} />
  );

  return (
    <div style={{ perspective: 800 }}>
      <motion.div
        style={{ rotateY, boxShadow: shadow }}
        initial={{ rotateY: 90 }}
        animate={{ rotateY: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.div
          style={{
            filter: useTransform(brightness, (v) => `brightness(${v})`),
          }}
        >
          {content}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function FlipPattern({ items, nested, randomize }: PatternProps) {
  return (
    <div className="grid">
      {items.map(({ card, promise }) => (
        <Suspense key={card.id} fallback={<SkeletonCard />}>
          <FlipCard promise={promise} nested={nested} randomize={randomize} />
        </Suspense>
      ))}
    </div>
  );
}
