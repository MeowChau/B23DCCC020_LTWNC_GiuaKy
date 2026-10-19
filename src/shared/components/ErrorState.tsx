import { Icon } from './Icon';

export function ErrorState({
  message,
  onRetry,
  busy = false,
}: {
  message: string;
  onRetry: () => void;
  busy?: boolean;
}) {
  return (
    <div className="error-state" role="alert">
      <span className="error-icon">
        <Icon name="info" />
      </span>
      <div>
        <h2>Chưa tải được thư viện</h2>
        <p>{message}</p>
      </div>
      <button
        className="button button-secondary"
        type="button"
        onClick={onRetry}
        disabled={busy}
      >
        <Icon name="refresh" />
        Thử lại
      </button>
    </div>
  );
}
