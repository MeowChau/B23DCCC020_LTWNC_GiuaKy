export function LoadingState({ compact = false }: { compact?: boolean }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" />
      <p>Đang tải...</p>
      {!compact && (
        <div className="skeleton-grid" aria-hidden="true">
          {['a', 'b', 'c', 'd', 'e', 'f'].map((id) => (
            <div className="skeleton-card" key={id}>
              <div />
              <span />
              <span />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
