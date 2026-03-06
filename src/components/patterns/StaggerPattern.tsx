import { motion } from "motion/react";
import {
  Suspense,
  createContext,
  use,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { Card } from "../Card.tsx";
import { NestedCard } from "../NestedCard.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

type StaggerContextValue = {
  getIndex: () => number;
};

const StaggerContext = createContext<StaggerContextValue>({
  getIndex: () => 0,
});

function StaggerProvider({ children }: { children: React.ReactNode }) {
  const counterRef = useRef(0);
  const getIndex = useCallback(() => counterRef.current++, []);
  return <StaggerContext value={{ getIndex }}>{children}</StaggerContext>;
}

function StaggerCard({
  promise,
  nested,
  randomize,
}: {
  promise: Promise<CardData>;
  nested: boolean;
  randomize: boolean;
}) {
  const data = use(promise);
  const { getIndex } = useContext(StaggerContext);
  const [index] = useState(() => getIndex());

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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {content}
    </motion.div>
  );
}

export function StaggerPattern({ items, nested, randomize }: PatternProps) {
  return (
    <StaggerProvider>
      <div className="grid">
        {items.map(({ card, promise }) => (
          <Suspense key={card.id} fallback={<SkeletonCard />}>
            <StaggerCard
              promise={promise}
              nested={nested}
              randomize={randomize}
            />
          </Suspense>
        ))}
      </div>
    </StaggerProvider>
  );
}
