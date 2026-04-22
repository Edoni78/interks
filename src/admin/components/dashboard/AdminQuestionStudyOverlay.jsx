import { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { QuestionFlipCard } from './QuestionFlipCard';

export function AdminQuestionStudyOverlay({ open, questions, startIndex, categoryLabel, t, onClose }) {
  const [index, setIndex] = useState(0);
  const total = questions.length;
  const current = total > 0 ? questions[index] : null;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  useEffect(() => {
    if (open) setIndex(Math.min(Math.max(0, startIndex), Math.max(0, total - 1)));
  }, [open, startIndex, total]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (total === 0) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIndex((i) => Math.min(total - 1, i + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, total]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleBackdrop = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!open || !current) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={handleBackdrop}
    >
      <div
        className="flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-dialog-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{t('admin.dashboard.studyEyebrow')}</p>
            <h2 id="study-dialog-title" className="mt-1 font-display text-lg font-semibold text-ink sm:text-xl">
              {t('admin.dashboard.studyTitle')}
            </h2>
            {categoryLabel ? (
              <p className="mt-2 truncate text-sm text-ink-muted">{categoryLabel}</p>
            ) : null}
            <p className="mt-2 text-xs text-ink-muted">
              {t('admin.dashboard.studyProgress', { current: index + 1, total })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-line bg-canvas p-2.5 text-ink-muted transition hover:bg-subtle hover:text-ink"
            aria-label={t('admin.dashboard.closeDialog')}
          >
            <FaTimes className="text-base" aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <p className="mb-4 text-center text-xs text-ink-muted">{t('admin.dashboard.flashcardHint')}</p>
          <QuestionFlipCard
            key={current.id}
            t={t}
            questionText={current.question_sq}
            answerText={current.answer_sq}
            minHeightClass="min-h-[min(48vh,400px)]"
          />
        </div>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-[11px] text-ink-muted sm:text-left">{t('admin.dashboard.studyKeyboardHint')}</p>
          <div className="flex gap-2 sm:justify-end">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setIndex((i) => i - 1)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              <FaChevronLeft aria-hidden />
              {t('admin.dashboard.studyPrevious')}
            </button>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setIndex((i) => i + 1)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              {t('admin.dashboard.studyNext')}
              <FaChevronRight aria-hidden />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
