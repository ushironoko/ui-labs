import { motion } from "motion/react";
import { Suspense, use } from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { Card } from "../Card.tsx";
import { NestedCard } from "../NestedCard.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

const VARIANTS = [
  {
    initial: { opacity: 0, scale: 0.3, rotate: -12 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
  },
  {
    initial: { opacity: 0, scale: 0.3, rotate: 12 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
  },
  {
    initial: { opacity: 0, y: 60, scale: 0.7 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  {
    initial: { opacity: 0, x: -50, rotate: -8 },
    animate: { opacity: 1, x: 0, rotate: 0 },
  },
  {
    initial: { opacity: 0, x: 50, rotate: 8 },
    animate: { opacity: 1, x: 0, rotate: 0 },
  },
  {
    initial: { opacity: 0, scale: 1.4, rotate: 6 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
  },
];

function PlayfulCard({
  promise,
  index,
  nested,
  randomize,
}: {
  promise: Promise<CardData>;
  index: number;
  nested: boolean;
  randomize: boolean;
}) {
  const data = use(promise);
  const variant = VARIANTS[index % VARIANTS.length];

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
      initial={variant.initial}
      animate={variant.animate}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 18,
        mass: 0.8,
      }}
    >
      <div
        className="card-glow"
        style={{ "--glow-color": `${data.color}55` } as React.CSSProperties}
      >
        {content}
      </div>
    </motion.div>
  );
}

export function PlayfulPattern({ items, nested, randomize }: PatternProps) {
  return (
    <div className="grid">
      {items.map(({ card, promise }, i) => (
        <Suspense key={card.id} fallback={<SkeletonCard playful />}>
          <PlayfulCard
            promise={promise}
            index={i}
            nested={nested}
            randomize={randomize}
          />
        </Suspense>
      ))}
    </div>
  );
}
