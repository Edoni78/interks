import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaRedo, FaTimes } from 'react-icons/fa';
import { finishStudySession, insertStudySession } from '../../../lib/studySessionLog';
import { logStudyProgressEvent } from '../../../lib/studyProgressLog';
import { QuestionFlipCard } from './QuestionFlipCard';
import { QuestionMultipleChoiceStudy } from './QuestionMultipleChoiceStudy';

function shuffleDeck(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function AdminQuestionStudyOverlay({ open, questions, startIndex, categoryId, categoryLabel, t, onClose }) {
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('studying');
  const [shuffleOnRestart, setShuffleOnRestart] = useState(false);
  const [restartNonce, setRestartNonce] = useState(0);
  const sessionIdRef = useRef(null);
  const phaseRef = useRef('studying');
  const pendingShuffleRef = useRef(false);
  const deckRef = useRef([]);
  const indexRef = useRef(0);
  const questionsRef = useRef(questions);
  questionsRef.current = questions;

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    deckRef.current = deck;
    indexRef.current = index;
  }, [deck, index]);

  useLayoutEffect(() => {
    if (!open) return;
    const src = questionsRef.current || [];
    if (!src.length) {
      setDeck([]);
      return;
    }
    const shuffled = pendingShuffleRef.current;
    pendingShuffleRef.current = false;
    const nextDeck = shuffled ? shuffleDeck(src) : [...src];
    setDeck(nextDeck);
    const ix = shuffled ? 0 : Math.min(Math.max(0, startIndex), Math.max(0, nextDeck.length - 1));
    setIndex(ix);
    setPhase('studying');
    sessionIdRef.current = null;
    void (async () => {
      const sid = await insertStudySession(categoryId, nextDeck.length, shuffled);
      sessionIdRef.current = sid;
    })();
  }, [open, startIndex, restartNonce, categoryId]);

  useEffect(() => {
    if (open) return;
    const sid = sessionIdRef.current;
    sessionIdRef.current = null;
    if (sid && phaseRef.current === 'studying') {
      void finishStudySession(sid);
    }
    setShuffleOnRestart(false);
  }, [open]);

  const goNext = useCallback(() => {
    if (phaseRef.current !== 'studying') return;
    const len = deckRef.current.length;
    const i = indexRef.current;
    if (len === 0) return;
    if (i >= len - 1) {
      setPhase('complete');
      void finishStudySession(sessionIdRef.current);
      return;
    }
    setIndex(i + 1);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (phaseRef.current === 'complete') return;
      if (!deckRef.current.length) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIndex((prev) => Math.max(0, prev - 1));
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, goNext]);

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

  const logCardReveal = useCallback(() => {
    const q = deckRef.current[indexRef.current];
    if (!categoryId || !q?.id) return;
    logStudyProgressEvent({ categoryId, questionId: q.id, eventKind: 'card_reveal' });
  }, [categoryId]);

  const logOptions = useCallback(
    (correct) => {
      const q = deckRef.current[indexRef.current];
      if (!categoryId || !q?.id) return;
      logStudyProgressEvent({
        categoryId,
        questionId: q.id,
        eventKind: correct ? 'mc_correct' : 'mc_incorrect',
      });
    },
    [categoryId],
  );

  const handleRifillo = useCallback(() => {
    pendingShuffleRef.current = shuffleOnRestart;
    setRestartNonce((n) => n + 1);
    setPhase('studying');
  }, [shuffleOnRestart]);

  if (!open || !questions?.length) return null;

  if (phase === 'complete') {
    const n = deck.length || questions.length;
    return (
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
        role="presentation"
        onMouseDown={handleBackdrop}
      >
        <div
          className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-complete-title"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <header className="border-b border-line bg-subtle/40 px-6 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">{t('admin.dashboard.studyEyebrow')}</p>
            <h2 id="session-complete-title" className="mt-2 font-display text-xl font-semibold text-ink">
              {t('admin.dashboard.studySessionCompleteTitle')}
            </h2>
            {categoryLabel ? <p className="mt-2 text-sm text-ink-muted">{categoryLabel}</p> : null}
          </header>
          <div className="space-y-5 px-6 py-6">
            <p className="text-sm leading-relaxed text-ink">{t('admin.dashboard.studySessionCompleteBody', { count: n })}</p>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink shadow-sm">
              <input
                type="checkbox"
                checked={shuffleOnRestart}
                onChange={(e) => setShuffleOnRestart(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
              />
              <span>{t('admin.dashboard.studyShuffleDeckLabel')}</span>
            </label>
          </div>
          <footer className="flex flex-col gap-2 border-t border-line bg-subtle/30 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line bg-canvas px-5 py-3 text-sm font-semibold text-ink transition hover:bg-subtle"
            >
              {t('admin.dashboard.studySessionClose')}
            </button>
            <button
              type="button"
              onClick={handleRifillo}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover"
            >
              <FaRedo aria-hidden />
              {t('admin.dashboard.studySessionAgain')}
            </button>
          </footer>
        </div>
      </div>
    );
  }

  const activeDeck = deck.length > 0 ? deck : questions;
  const total = activeDeck.length;
  const safeIndex = Math.min(index, Math.max(0, total - 1));
  const current = activeDeck[safeIndex];
  if (!current) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" role="presentation">
        <p className="rounded-xl border border-line bg-canvas px-6 py-4 text-sm text-ink-muted">{t('admin.dashboard.studyDeckLoading')}</p>
      </div>
    );
  }

  const canPrev = safeIndex > 0;
  const isLastCard = total > 0 && safeIndex >= total - 1;

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
            <p className="mt-1 text-xs text-ink-muted">{t('admin.dashboard.studyDeckMeta', { count: total })}</p>
            <p className="mt-1 text-xs font-medium text-accent">{t('admin.dashboard.studySessionActive')}</p>
            <p className="mt-2 text-xs text-ink-muted">
              {t('admin.dashboard.studyProgress', { current: safeIndex + 1, total })}
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
          {current.question_kind === 'multiple_choice' ? (
            <>
              <p className="mb-4 text-center text-xs text-ink-muted">{t('admin.dashboard.studyOptionsHint')}</p>
              <QuestionMultipleChoiceStudy
                key={current.id}
                question={current}
                t={t}
                minHeightClass="min-h-[min(48vh,400px)]"
                onOptionsResult={logOptions}
              />
            </>
          ) : (
            <>
              <p className="mb-4 text-center text-xs text-ink-muted">{t('admin.dashboard.flashcardHint')}</p>
              <QuestionFlipCard
                key={current.id}
                t={t}
                questionId={current.id}
                questionText={current.question_sq}
                answerText={current.answer_sq}
                minHeightClass="min-h-[min(48vh,400px)]"
                onRevealAnswer={logCardReveal}
              />
            </>
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-[11px] text-ink-muted sm:text-left">{t('admin.dashboard.studyKeyboardHint')}</p>
          <div className="flex gap-2 sm:justify-end">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              <FaChevronLeft aria-hidden />
              {t('admin.dashboard.studyPrevious')}
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-subtle sm:flex-none"
            >
              {isLastCard ? t('admin.dashboard.studyFinishDeck') : t('admin.dashboard.studyNext')}
              {!isLastCard ? <FaChevronRight aria-hidden /> : null}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
