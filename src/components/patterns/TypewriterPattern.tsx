import { type Variants, motion } from "motion/react";
import { Suspense, use } from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { NestedCard } from "../NestedCard.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function TypewriterCard({
  data,
  nested,
  randomize,
}: {
  data: CardData;
  nested: boolean;
  randomize: boolean;
}) {
  if (nested) {
    return (
      <NestedCard
        data={data}
        fields={getFieldPromises(data.id, data, randomize)}
      />
    );
  }

  return (
    <motion.div
      className="card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="card-accent" style={{ background: data.color }} />
      <motion.span className="card-icon" variants={itemVariants}>
        {data.icon}
      </motion.span>
      <motion.div className="card-title" variants={itemVariants}>
        {data.title}
      </motion.div>
      <motion.div
        className="card-value"
        style={{ color: data.color }}
        variants={itemVariants}
      >
        {data.value}
      </motion.div>
      <motion.div className="card-description" variants={itemVariants}>
        {data.description}
      </motion.div>
    </motion.div>
  );
}

function AsyncTypewriterCard({
  promise,
  nested,
  randomize,
}: {
  promise: Promise<CardData>;
  nested: boolean;
  randomize: boolean;
}) {
  const data = use(promise);
  return <TypewriterCard data={data} nested={nested} randomize={randomize} />;
}

export function TypewriterPattern({ items, nested, randomize }: PatternProps) {
  return (
    <div className="grid">
      {items.map(({ card, promise }) => (
        <Suspense key={card.id} fallback={<SkeletonCard />}>
          <AsyncTypewriterCard
            promise={promise}
            nested={nested}
            randomize={randomize}
          />
        </Suspense>
      ))}
    </div>
  );
}
