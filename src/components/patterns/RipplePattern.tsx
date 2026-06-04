import { type AnimationScope, useAnimate } from "motion/react";
import {
  Suspense,
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import type { CardData, PatternProps } from "../../data.ts";
import { getFieldPromises } from "../../data.ts";
import { Card } from "../Card.tsx";
import { NestedCard } from "../NestedCard.tsx";
import { SkeletonCard } from "../SkeletonCard.tsx";

type RippleContextValue = {
  register: (id: string, scope: AnimationScope<HTMLDivElement>) => void;
  unregister: (id: string) => void;
  notifyResolved: (id: string, color: string) => void;
};

const RippleContext = createContext<RippleContextValue>({
  register: () => {},
  unregister: () => {},
  notifyResolved: () => {},
});

function RippleProvider({ children }: { children: React.ReactNode }) {
  const scopesRef = useRef<Map<string, AnimationScope<HTMLDivElement>>>(
    new Map(),
  );

  const register = useCallback(
    (id: string, scope: AnimationScope<HTMLDivElement>) => {
      scopesRef.current.set(id, scope);
    },
    [],
  );

  const unregister = useCallback((id: string) => {
    scopesRef.current.delete(id);
  }, []);

  const notifyResolved = useCallback((resolvedId: string, color: string) => {
    for (const [id, scope] of scopesRef.current) {
      if (id === resolvedId) continue;
      const el = scope.current;
      if (!el) continue;

      el.animate(
        [
          { transform: "scale(1)", boxShadow: "0 0 0 0px transparent" },
          {
            transform: "scale(1.04)",
            boxShadow: `0 0 0 2px ${color}66`,
          },
          { transform: "scale(1)", boxShadow: "0 0 0 0px transparent" },
        ],
        { duration: 400, easing: "ease-out" },
      );
    }
  }, []);

  return (
    <RippleContext value={{ register, unregister, notifyResolved }}>
      {children}
    </RippleContext>
  );
}

function RippleCard({
  promise,
  nested,
  randomize,
}: {
  promise: Promise<CardData>;
  nested: boolean;
  randomize: boolean;
}) {
  const data = use(promise);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const { register, unregister, notifyResolved } = useContext(RippleContext);

  useEffect(() => {
    register(data.id, scope);
    return () => unregister(data.id);
  }, [data.id, register, unregister, scope]);

  useEffect(() => {
    animate(
      scope.current,
      { opacity: [0, 1], scale: [0.92, 1] },
      { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    );
    notifyResolved(data.id, data.color);
  }, [animate, scope, data.id, data.color, notifyResolved]);

  const content = nested ? (
    <NestedCard
      data={data}
      fields={getFieldPromises(data.id, data, randomize)}
    />
  ) : (
    <Card data={data} />
  );

  return (
    <div ref={scope} style={{ borderRadius: 14 }}>
      {content}
    </div>
  );
}

export function RipplePattern({ items, nested, randomize }: PatternProps) {
  return (
    <RippleProvider>
      <div className="grid">
        {items.map(({ card, promise }) => (
          <Suspense key={card.id} fallback={<SkeletonCard />}>
            <RippleCard
              promise={promise}
              nested={nested}
              randomize={randomize}
            />
          </Suspense>
        ))}
      </div>
    </RippleProvider>
  );
}
