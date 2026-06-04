import { type RefObject, use, useRef } from "react";
import type { PocData } from "./pocData.ts";

type Props = {
  promise: Promise<PocData>;
  stateC: number;
  fallbackCountRef: RefObject<number>;
};

export function C({ promise, stateC, fallbackCountRef }: Props) {
  const data = use(promise);
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="poc-box" data-component="c">
      <div className="poc-box-header">
        <span className="poc-box-name">C.tsx</span>
        <span key={renderCount.current} className="poc-render-badge">
          render #{renderCount.current}
        </span>
      </div>
      <div className="poc-box-row">
        state_c: <strong>{stateC}</strong>
      </div>
      <div className="poc-box-row">data: {data.title}</div>
      <div className="poc-box-row">fetch解決時刻: {data.fetchedAt}</div>
      <div className="poc-box-row poc-box-muted">
        fallback表示回数: {fallbackCountRef.current}
      </div>
    </div>
  );
}
