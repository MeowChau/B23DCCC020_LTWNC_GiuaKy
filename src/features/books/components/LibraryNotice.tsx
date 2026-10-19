import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Icon } from '../../../shared/components/Icon';
import { selectNotice } from '../booksSelectors';
import { dismissNotice } from '../booksSlice';

export function LibraryNotice() {
  const dispatch = useAppDispatch();
  const notice = useAppSelector(selectNotice);
  useEffect(() => {
    if (notice?.kind !== 'success') return;
    const timer = window.setTimeout(() => {
      dispatch(dismissNotice());
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [notice, dispatch]);
  return (
    <div className="notice-region">
      {notice && (
        <div
          className={'library-notice notice-' + notice.kind}
          role={notice.kind === 'warning' ? 'alert' : 'status'}
        >
          <span className="notice-symbol">
            <Icon name={notice.kind === 'warning' ? 'info' : 'check'} />
          </span>
          <p>{notice.message}</p>
          <button
            className="icon-button"
            type="button"
            aria-label="Đóng thông báo"
            onClick={() => dispatch(dismissNotice())}
          >
            <Icon name="close" />
          </button>
        </div>
      )}
    </div>
  );
}
