export function SkeletonCard({ playful = false }: { playful?: boolean }) {
  return (
    <div className={playful ? "skeleton-playful" : "skeleton"}>
      <div className="skeleton-line skeleton-icon" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-value" />
      <div className="skeleton-line skeleton-desc" />
    </div>
  );
}
