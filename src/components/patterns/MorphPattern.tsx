import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { Card } from "../Card.tsx";
import { NestedCard } from "../NestedCard.tsx";

function MorphSkeleton() {
  return (
    <motion.div
      className="skeleton"
      exit={{
        filter: "blur(6px)",
        scale: 0.92,
        opacity: 0,
      }}
      transition={{ duration: 0.3, ease: "easeIn" }}
    >
      <div className="skeleton-line skeleton-icon" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-value" />
      <div className="skeleton-line skeleton-desc" />
    </motion.div>
  );
}

function MorphContent({
  data,
  nested,
  randomize,
}: {
  data: CardData;
  nested: boolean;
  randomize: boolean;
}) {
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
      initial={{ filter: "blur(6px)", scale: 1.06, opacity: 0 }}
      animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}

function MorphCard({
  promise,
  nested,
  randomize,
}: {
  promise: Promise<CardData>;
  nested: boolean;
  randomize: boolean;
}) {
  const [data, setData] = useState<CardData | null>(null);

  useEffect(() => {
    let cancelled = false;
    promise.then((resolved) => {
      if (!cancelled) setData(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [promise]);

  return (
    <AnimatePresence mode="wait">
      {data === null ? (
        <MorphSkeleton key="skeleton" />
      ) : (
        <MorphContent
          key="content"
          data={data}
          nested={nested}
          randomize={randomize}
        />
      )}
    </AnimatePresence>
  );
}

export function MorphPattern({ items, nested, randomize }: PatternProps) {
  return (
    <div className="grid">
      {items.map(({ card, promise }) => (
        <MorphCard
          key={card.id}
          promise={promise}
          nested={nested}
          randomize={randomize}
        />
      ))}
    </div>
  );
}
