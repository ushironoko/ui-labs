export type PocData = {
  title: string;
  fetchedAt: string;
};

const DELAY_MS = 1500;

// 実際の fetch() に人工遅延を足して返す。
// 意図的にモジュールキャッシュを持たない:
// Promise の安定化は呼び出し側(A.tsx)の責務であることを実証するため。
export async function fetchPocData(): Promise<PocData> {
  const fetchedAt = new Date().toLocaleTimeString("ja-JP", {
    hour12: false,
  });
  const res = await fetch("/poc-data.json");
  const json = (await res.json()) as { title: string };
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return { title: json.title, fetchedAt };
}
