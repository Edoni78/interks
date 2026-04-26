import { useEffect, useRef, useState } from 'react';

export function QuestionFlipCard({
  t,
  questionText,
  answerText,
  questionId,
  onRevealAnswer,
  minHeightClass = 'min-h-[min(42vh,360px)]',
}) {
  const [flipped, setFlipped] = useState(false);
  const loggedRef = useRef(false);

  useEffect(() => {
    loggedRef.current = false;
    setFlipped(false);
  }, [questionId]);

  const handleClick = () => {
    setFlipped((prev) => {
      const next = !prev;
      if (next && onRevealAnswer && questionId && !loggedRef.current) {
        loggedRef.current = true;
        onRevealAnswer();
      }
      return next;
    });
  };

  return (
    <div className="[perspective:1400px]">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={flipped}
        aria-label={t('admin.dashboard.flashcardFlipAria')}
        className="block w-full rounded-xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-line focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <div
          className={`relative w-full ${minHeightClass} motion-reduce:transition-none transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:duration-0 ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div className="absolute inset-0 flex flex-col justify-center overflow-y-auto rounded-xl border border-line bg-canvas px-5 py-8 shadow-sm backface-hidden sm:px-8 sm:py-10 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{t('admin.dashboard.previewQuestion')}</p>
            <p className="mt-4 whitespace-pre-wrap text-base font-medium leading-relaxed text-ink sm:text-lg">{questionText || '—'}</p>
          </div>
          <div className="absolute inset-0 flex flex-col justify-center overflow-y-auto rounded-xl border border-line bg-subtle/35 px-5 py-8 shadow-sm backface-hidden sm:px-8 sm:py-10 [transform:rotateY(180deg)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{t('admin.dashboard.previewAnswer')}</p>
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-ink sm:text-lg">{answerText || '—'}</p>
          </div>
        </div>
      </button>
    </div>
  );
}
