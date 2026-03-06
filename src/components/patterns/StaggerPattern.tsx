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
import type { CardData } from "../../data.ts";
import { Card } from "../Card.tsx";
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

function StaggerCard({ promise }: { promise: Promise<CardData> }) {
  const data = use(promise);
  const { getIndex } = useContext(StaggerContext);
  const [index] = useState(() => getIndex());

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
      <Card data={data} />
    </motion.div>
  );
}

export function StaggerPattern({
  items,
}: {
  items: { card: CardData; promise: Promise<CardData> }[];
}) {
  return (
    <StaggerProvider>
      <div className="grid">
        {items.map(({ card, promise }) => (
          <Suspense key={card.id} fallback={<SkeletonCard />}>
            <StaggerCard promise={promise} />
          </Suspense>
        ))}
      </div>
    </StaggerProvider>
  );
}
