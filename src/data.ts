export type CardData = {
  id: string;
  title: string;
  icon: string;
  value: string;
  description: string;
  color: string;
  delay: number;
};

const CARDS: CardData[] = [
  {
    id: "users",
    title: "Active Users",
    icon: "👥",
    value: "12,847",
    description: "↑ 12% from last week",
    color: "#6366f1",
    delay: 300,
  },
  {
    id: "revenue",
    title: "Revenue",
    icon: "💰",
    value: "$48,295",
    description: "↑ 8.2% from last month",
    color: "#22c55e",
    delay: 600,
  },
  {
    id: "orders",
    title: "New Orders",
    icon: "📦",
    value: "1,284",
    description: "↓ 3% from yesterday",
    color: "#f59e0b",
    delay: 900,
  },
  {
    id: "messages",
    title: "Messages",
    icon: "💬",
    value: "847",
    description: "32 unread",
    color: "#ec4899",
    delay: 1300,
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: "✅",
    value: "24/38",
    description: "63% completed",
    color: "#14b8a6",
    delay: 1700,
  },
  {
    id: "analytics",
    title: "Page Views",
    icon: "📊",
    value: "284K",
    description: "↑ 24% this month",
    color: "#8b5cf6",
    delay: 2200,
  },
];

let generation = 0;
const cache = new Map<string, Promise<CardData>>();

function createDelayedPromise(
  data: CardData,
  randomize: boolean,
): Promise<CardData> {
  const delay = randomize ? Math.random() * 2500 + 200 : data.delay;
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

export function getCardPromises(randomize: boolean) {
  return CARDS.map((card) => {
    const key = `${card.id}-${generation}`;
    if (!cache.has(key)) {
      cache.set(key, createDelayedPromise(card, randomize));
    }
    return { card, promise: cache.get(key) as Promise<CardData> };
  });
}

export function resetCache() {
  generation++;
}
