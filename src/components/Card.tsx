import type { CardData } from "../data.ts";

export function Card({ data }: { data: CardData }) {
  return (
    <div className="card">
      <div className="card-accent" style={{ background: data.color }} />
      <span className="card-icon">{data.icon}</span>
      <div className="card-title">{data.title}</div>
      <div className="card-value" style={{ color: data.color }}>
        {data.value}
      </div>
      <div className="card-description">{data.description}</div>
    </div>
  );
}
