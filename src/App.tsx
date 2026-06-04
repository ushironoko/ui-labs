import { useCallback, useState } from "react";
import { IsolationLab } from "./components/isolation/IsolationLab.tsx";
import { FadePattern } from "./components/patterns/FadePattern.tsx";
import { FlipPattern } from "./components/patterns/FlipPattern.tsx";
import { MorphPattern } from "./components/patterns/MorphPattern.tsx";
import { PlayfulPattern } from "./components/patterns/PlayfulPattern.tsx";
import { PopcornPattern } from "./components/patterns/PopcornPattern.tsx";
import { RevealPattern } from "./components/patterns/RevealPattern.tsx";
import { RipplePattern } from "./components/patterns/RipplePattern.tsx";
import { StaggerPattern } from "./components/patterns/StaggerPattern.tsx";
import { TypewriterPattern } from "./components/patterns/TypewriterPattern.tsx";
import { getCardPromises, resetCache } from "./data.ts";

type PatternKey =
  | "popcorn"
  | "fade"
  | "stagger"
  | "playful"
  | "reveal"
  | "flip"
  | "ripple"
  | "typewriter"
  | "morph";

const PATTERNS: { key: PatternKey; label: string; description: string }[] = [
  {
    key: "popcorn",
    label: "Popcorn",
    description:
      "素のSuspense。各カードが独立にスケルトン→コンテンツに置換される。バラバラに出現するポップコーン効果。",
  },
  {
    key: "fade",
    label: "Fade",
    description:
      "フェードトランジション。コンテンツ出現時にopacity + translateYアニメーションを適用。",
  },
  {
    key: "stagger",
    label: "Stagger",
    description:
      "解決順序ベースのスタッガー。先に解決されたカードから順にカスケード表示。",
  },
  {
    key: "playful",
    label: "Playful",
    description:
      "スプリング物理 + ランダムバリアント。バウンス・回転・スケールで楽しい表現。",
  },
  {
    key: "reveal",
    label: "Reveal",
    description:
      "clipPath幕開け演出。カード中心から外側へclipPathが広がり、ブラーが解除される。レイアウトシフトゼロ。",
  },
  {
    key: "flip",
    label: "Flip",
    description:
      "3DカードフリップY軸回転。回転角に連動してbrightness/shadowが動的変化。カードめくりメタファー。",
  },
  {
    key: "ripple",
    label: "Ripple",
    description:
      "解決波紋連鎖。カード解決時、表示済みの他カードに微小pulseが連鎖。カード間に因果関係を作る。",
  },
  {
    key: "typewriter",
    label: "Typewriter",
    description:
      "variants + staggerChildrenによるカード内段階構築。icon→title→value→descが上から順にフェードイン。",
  },
  {
    key: "morph",
    label: "Morph",
    description:
      "AnimatePresenceによるスケルトン退場アニメーション。スケルトンがblur+scale downで退場→コンテンツが入場。",
  },
];

const PATTERN_COMPONENTS = {
  popcorn: PopcornPattern,
  fade: FadePattern,
  stagger: StaggerPattern,
  playful: PlayfulPattern,
  reveal: RevealPattern,
  flip: FlipPattern,
  ripple: RipplePattern,
  typewriter: TypewriterPattern,
  morph: MorphPattern,
} as const;

export function App() {
  const [view, setView] = useState<"patterns" | "isolation">("patterns");
  const [pattern, setPattern] = useState<PatternKey>("popcorn");
  const [randomize, setRandomize] = useState(false);
  const [nested, setNested] = useState(false);
  const [generation, setGeneration] = useState(0);

  const handleReset = useCallback(() => {
    resetCache();
    setGeneration((g) => g + 1);
  }, []);

  const items = getCardPromises(randomize);
  const currentPattern = PATTERNS.find(
    (p) => p.key === pattern,
  ) as (typeof PATTERNS)[number];
  const PatternComponent = PATTERN_COMPONENTS[pattern];

  return (
    <div className="app">
      <header className="header">
        <h1>UI Labs</h1>
        <p>Popcorn UI vs Animated Transitions</p>
      </header>

      <div className="view-switch">
        <button
          type="button"
          className="tab"
          data-active={view === "patterns"}
          onClick={() => setView("patterns")}
        >
          Patterns
        </button>
        <button
          type="button"
          className="tab"
          data-active={view === "isolation"}
          onClick={() => setView("isolation")}
        >
          Suspense Isolation PoC
        </button>
      </div>

      {view === "isolation" ? (
        <IsolationLab />
      ) : (
        <>
          <div className="controls">
            {PATTERNS.map((p) => (
              <button
                type="button"
                key={p.key}
                className="tab"
                data-active={pattern === p.key}
                onClick={() => {
                  setPattern(p.key);
                  handleReset();
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="pattern-description">
            {currentPattern.description}
          </div>

          <div className="options">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={randomize}
                onChange={(e) => {
                  setRandomize(e.target.checked);
                  handleReset();
                }}
              />
              ランダム遅延
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={nested}
                onChange={(e) => {
                  setNested(e.target.checked);
                  handleReset();
                }}
              />
              ネスト遅延
            </label>
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>

          <PatternComponent
            key={generation}
            items={items}
            nested={nested}
            randomize={randomize}
          />
        </>
      )}
    </div>
  );
}
