import { useCallback, useState } from "react";
import { FadePattern } from "./components/patterns/FadePattern.tsx";
import { PlayfulPattern } from "./components/patterns/PlayfulPattern.tsx";
import { PopcornPattern } from "./components/patterns/PopcornPattern.tsx";
import { StaggerPattern } from "./components/patterns/StaggerPattern.tsx";
import { getCardPromises, resetCache } from "./data.ts";

type PatternKey = "popcorn" | "fade" | "stagger" | "playful";

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
];

const PATTERN_COMPONENTS = {
  popcorn: PopcornPattern,
  fade: FadePattern,
  stagger: StaggerPattern,
  playful: PlayfulPattern,
} as const;

export function App() {
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

      <div className="pattern-description">{currentPattern.description}</div>

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
    </div>
  );
}
