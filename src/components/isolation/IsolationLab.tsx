import { useState } from "react";
import { A, type PromiseStrategy } from "./A.tsx";

const STRATEGIES: { key: PromiseStrategy; label: string }[] = [
  { key: "stable", label: "stable (Promiseを保持)" },
  { key: "recreate", label: "recreate (render毎に再生成)" },
];

function describe(strategy: PromiseStrategy, memoized: boolean): string {
  if (strategy === "stable" && !memoized) {
    return "state_b更新 → Cも再レンダリングされる(render回数が増える)が、解決済みPromiseをuse()が同期的に読むためfallbackには戻らない。「再レンダリング」と「再サスペンド」は別物。";
  }
  if (strategy === "stable" && memoized) {
    return "state_b更新 → Cのpropsは不変(promise参照もstate_cも同じ)なのでmemoが効き、Cは再レンダリングすらされない。完全に独立したレンダリング管理が成立する。";
  }
  if (strategy === "recreate" && !memoized) {
    return "state_b更新 → Aの再レンダリングで新しいPromiseが生成され、BもCも再サスペンド。fallbackが再表示され、fetchも再発行される(fetch解決時刻が変わる)。";
  }
  return "state_b更新 → promise propが毎レンダー別参照になるためmemoは効かず、recreateと同じくCもfallbackに戻る。memoはPromise参照が安定していて初めて意味を持つ。";
}

export function IsolationLab() {
  const [strategy, setStrategy] = useState<PromiseStrategy>("stable");
  const [memoized, setMemoized] = useState(false);
  const [generation, setGeneration] = useState(0);

  return (
    <div className="isolation-lab">
      <div className="controls">
        {STRATEGIES.map((s) => (
          <button
            type="button"
            key={s.key}
            className="tab"
            data-active={strategy === s.key}
            onClick={() => {
              setStrategy(s.key);
              setGeneration((g) => g + 1);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="options">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={memoized}
            onChange={(e) => {
              setMemoized(e.target.checked);
              setGeneration((g) => g + 1);
            }}
          />
          B / C を React.memo でラップ
        </label>
        <button
          type="button"
          className="reset-btn"
          onClick={() => setGeneration((g) => g + 1)}
        >
          Reset (Aを再マウント)
        </button>
      </div>

      <div className="pattern-description">{describe(strategy, memoized)}</div>

      <A
        key={`${strategy}-${memoized}-${generation}`}
        strategy={strategy}
        memoized={memoized}
      />

      <p className="poc-note">
        ※ StrictMode (dev)
        では更新ごとにrenderが2回走るため、renderカウントは2ずつ増える。初回fetchやrecreate時のfetchも二重に発行されることがある。
      </p>
    </div>
  );
}
