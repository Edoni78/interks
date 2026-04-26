import { useEffect, useState } from 'react';
import { parseMcOptions } from '../../lib/questionMc';

function letterFor(i) {
  return String.fromCharCode(65 + i);
}

export function QuestionMultipleChoiceStudy({ question, t, minHeightClass = 'min-h-[min(48vh,400px)]', onOptionsResult }) {
  const options = parseMcOptions(question?.mc_options);
  const correctIdx = Number(question?.mc_correct_index);
  const safeCorrect =
    Number.isFinite(correctIdx) && correctIdx >= 0 && correctIdx < options.length ? Math.floor(correctIdx) : 0;
  const explanation = (question?.answer_sq || '').trim();
  const correctText = options[safeCorrect] || '';
  const showExplanation = Boolean(explanation && explanation !== correctText);

  const [chosen, setChosen] = useState(null);

  useEffect(() => {
    setChosen(null);
  }, [question?.id]);

  if (options.length < 2) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {t('admin.dashboard.studyOptionsInvalid')}
      </p>
    );
  }

  const isCorrect = chosen !== null && chosen === safeCorrect;
  const locked = chosen !== null;

  return (
    <div className={`space-y-5 ${minHeightClass}`}>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{t('admin.dashboard.previewQuestion')}</p>
        <p className="mt-3 whitespace-pre-wrap text-base font-medium leading-relaxed text-ink sm:text-lg">
          {question?.question_sq?.trim() || '—'}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-ink-muted">{t('admin.dashboard.studyOptionsPick')}</p>
        <div className="flex flex-col gap-2">
          {options.map((opt, i) => {
            const show = locked;
            const isThis = chosen === i;
            const isRight = i === safeCorrect;
            let cls =
              'w-full rounded-xl border border-line bg-canvas px-4 py-3 text-left text-sm leading-relaxed text-ink shadow-sm transition hover:bg-subtle disabled:cursor-default';
            if (show && isRight) cls += ' border-green-500/80 bg-green-50 ring-1 ring-green-200/80';
            else if (show && isThis && !isRight) cls += ' border-red-400/90 bg-red-50 ring-1 ring-red-200/80';
            return (
              <button
                key={i}
                type="button"
                disabled={locked}
                onClick={() => {
                  if (locked) return;
                  const correct = i === safeCorrect;
                  if (onOptionsResult) onOptionsResult(correct);
                  setChosen(i);
                }}
                className={cls}
              >
                <span className="font-semibold tabular-nums text-ink-muted">{letterFor(i)}.</span>{' '}
                <span className="text-ink">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {chosen !== null && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
            isCorrect ? 'border-green-200 bg-green-50 text-green-950' : 'border-red-200 bg-red-50 text-red-950'
          }`}
        >
          <p className="font-semibold">{isCorrect ? t('admin.dashboard.studyOptionsCorrectTitle') : t('admin.dashboard.studyOptionsWrongTitle')}</p>
          {!isCorrect && correctText ? (
            <p className="mt-2 text-sm">
              {t('admin.dashboard.studyOptionsCorrectWas', { letter: letterFor(safeCorrect), text: correctText })}
            </p>
          ) : null}
        </div>
      )}

      {chosen !== null && showExplanation ? (
        <div className="rounded-xl border border-line bg-subtle/40 px-4 py-3 text-sm text-ink">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{t('admin.dashboard.studyOptionsExplanation')}</p>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{explanation}</p>
        </div>
      ) : null}
    </div>
  );
}
