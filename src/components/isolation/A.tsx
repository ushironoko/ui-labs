import { type RefObject, Suspense, memo, useRef, useState } from "react";
import { B } from "./B.tsx";
import { C } from "./C.tsx";
import { type PocData, fetchPocData } from "./pocData.ts";

export type PromiseStrategy = "stable" | "recreate";

const MemoB = memo(B);
const MemoC = memo(C);

function Fallback({
  name,
  countRef,
}: {
  name: string;
  countRef: RefObject<number>;
}) {
  // マウントごとに1回だけカウントする(StrictModeの二重renderでも重複しない)
  const counted = useRef(false);
  if (!counted.current) {
    counted.current = true;
    countRef.current += 1;
  }

  return (
    <div className="poc-box poc-fallback" data-component={name.toLowerCase()}>
      <div className="poc-box-header">
        <span className="poc-box-name">{name}.tsx</span>
        <span className="poc-render-badge poc-render-badge-loading">
          loading
        </span>
      </div>
      <div className="poc-box-row">Suspense fallback 表示中…</div>
      <div className="poc-box-row poc-box-muted">
        fallback表示回数: {countRef.current}
      </div>
    </div>
  );
}

type Props = {
  strategy: PromiseStrategy;
  memoized: boolean;
};

export function A({ strategy, memoized }: Props) {
  const [stateB, setStateB] = useState(0);
  const [stateC, setStateC] = useState(0);

  const renderCount = useRef(0);
  renderCount.current += 1;

  const fallbackCountB = useRef(0);
  const fallbackCountC = useRef(0);

  // stable: マウント時に1度だけ生成したPromiseを保持し、以後同じ参照を渡し続ける
  const [stablePromise] = useState<Promise<PocData> | null>(() =>
    strategy === "stable" ? fetchPocData() : null,
  );
  // recreate: Aが再レンダリングされるたびに新しいPromise(=新しいfetch)を生成するアンチパターン
  const promise = stablePromise ?? fetchPocData();

  const BComponent = memoized ? MemoB : B;
  const CComponent = memoized ? MemoC : C;

  return (
    <div className="poc-parent">
      <div className="poc-parent-header">
        <span className="poc-box-name">A.tsx (親)</span>
        <span key={renderCount.current} className="poc-render-badge">
          render #{renderCount.current}
        </span>
      </div>
      <div className="poc-actions">
        <button
          type="button"
          className="poc-btn"
          onClick={() => setStateB((v) => v + 1)}
        >
          state_b + 1
        </button>
        <button
          type="button"
          className="poc-btn"
          onClick={() => setStateC((v) => v + 1)}
        >
          state_c + 1
        </button>
      </div>
      <div className="poc-children">
        <Suspense fallback={<Fallback name="B" countRef={fallbackCountB} />}>
          <BComponent
            promise={promise}
            stateB={stateB}
            fallbackCountRef={fallbackCountB}
          />
        </Suspense>
        <Suspense fallback={<Fallback name="C" countRef={fallbackCountC} />}>
          <CComponent
            promise={promise}
            stateC={stateC}
            fallbackCountRef={fallbackCountC}
          />
        </Suspense>
      </div>
    </div>
  );
}
