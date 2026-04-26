import { FaLightbulb, FaListOl, FaQuestion } from 'react-icons/fa';
import { MAX_OPTS, MIN_OPTS } from './lib/questionMc';

const inputClass =
  'mt-2 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-base leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20';

const textareaClass =
  'mt-2 min-h-[8rem] w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3.5 text-base leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20 sm:min-h-[9rem]';

const pillActive =
  'flex-1 rounded-xl bg-canvas px-4 py-3.5 text-base font-semibold text-ink shadow-sm ring-1 ring-line/80 sm:py-4';
const pillIdle =
  'flex-1 rounded-xl px-4 py-3.5 text-base font-medium text-ink-muted transition hover:bg-canvas/60 hover:text-ink sm:py-4';

export function QuestionEditorModalForm({ t, form, setForm, onSubmit, saving, onClose, localError }) {
  const isOpen = form.question_kind === 'open';

  const setKind = (question_kind) => {
    setForm((f) => ({
      ...f,
      question_kind,
      mc_options:
        question_kind === 'multiple_choice' && (!f.mc_options || f.mc_options.length < MIN_OPTS)
          ? ['', '']
          : f.mc_options,
      mc_correct_index:
        question_kind === 'multiple_choice'
          ? Math.min(Math.max(0, f.mc_correct_index || 0), Math.max(MIN_OPTS - 1, (f.mc_options?.length || MIN_OPTS) - 1))
          : 0,
    }));
  };

  const updateOption = (idx, value) => {
    setForm((f) => {
      const next = [...(f.mc_options || [])];
      next[idx] = value;
      return { ...f, mc_options: next };
    });
  };

  const addOption = () => {
    setForm((f) => {
      const cur = f.mc_options || ['', ''];
      if (cur.length >= MAX_OPTS) return f;
      return { ...f, mc_options: [...cur, ''] };
    });
  };

  const removeOption = (idx) => {
    setForm((f) => {
      const cur = [...(f.mc_options || [])];
      if (cur.length <= MIN_OPTS) return f;
      cur.splice(idx, 1);
      let nextCorrect = f.mc_correct_index || 0;
      if (nextCorrect >= cur.length) nextCorrect = cur.length - 1;
      if (nextCorrect < 0) nextCorrect = 0;
      return { ...f, mc_options: cur, mc_correct_index: nextCorrect };
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-10 sm:py-8">
        {localError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-base text-red-900" role="alert">
            {localError}
          </div>
        ) : null}

        <div>
          <p className="text-sm font-semibold text-ink-muted">{t('admin.dashboard.questionKindLabel')}</p>
          <div className="mt-2.5 flex rounded-xl border border-line/90 bg-subtle/50 p-1.5">
            <button type="button" className={isOpen ? pillActive : pillIdle} onClick={() => setKind('open')}>
              {t('admin.dashboard.questionKindOpen')}
            </button>
            <button type="button" className={!isOpen ? pillActive : pillIdle} onClick={() => setKind('multiple_choice')}>
              {t('admin.dashboard.questionKindOptions')}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-line/80 bg-canvas p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent ring-1 ring-line/50">
              <FaQuestion className="text-sm" aria-hidden />
            </span>
            <label htmlFor="q-main" className="text-base font-semibold text-ink">
              {t('admin.dashboard.questionField')}
            </label>
          </div>
          <textarea
            id="q-main"
            required
            rows={isOpen ? 6 : 5}
            value={form.question_sq}
            onChange={(e) => setForm((f) => ({ ...f, question_sq: e.target.value }))}
            className={textareaClass}
            placeholder={t('admin.dashboard.placeholderQuestion')}
          />
        </div>

        {isOpen ? (
          <div className="rounded-2xl border border-line/80 bg-canvas p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun/25 text-ink ring-1 ring-line/50">
                <FaLightbulb className="text-sm" aria-hidden />
              </span>
              <label htmlFor="a-open" className="text-base font-semibold text-ink">
                {t('admin.dashboard.answerField')}
              </label>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{t('admin.dashboard.answerGuidance')}</p>
            <textarea
              id="a-open"
              required
              rows={8}
              value={form.answer_sq}
              onChange={(e) => setForm((f) => ({ ...f, answer_sq: e.target.value }))}
              className={textareaClass}
              placeholder={t('admin.dashboard.placeholderAnswer')}
            />
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-line/80 bg-canvas p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun/25 text-ink ring-1 ring-line/50">
                  <FaListOl className="text-sm" aria-hidden />
                </span>
                <div>
                  <p className="text-base font-semibold text-ink">{t('admin.dashboard.mcOptionsLabel')}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{t('admin.dashboard.mcCorrectHint')}</p>
                </div>
              </div>
              <ul className="mt-5 space-y-4">
                {(form.mc_options || ['', '']).map((opt, idx) => (
                  <li key={idx} className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <label className="flex shrink-0 cursor-pointer items-center gap-2.5 pt-3 text-sm font-semibold text-ink-muted sm:w-32">
                      <input
                        type="radio"
                        name="mc-correct"
                        checked={form.mc_correct_index === idx}
                        onChange={() => setForm((f) => ({ ...f, mc_correct_index: idx }))}
                        className="h-5 w-5 accent-accent"
                      />
                      {String.fromCharCode(65 + idx)}
                    </label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className={`${inputClass} sm:flex-1`}
                      placeholder={`${String.fromCharCode(65 + idx)}…`}
                      autoComplete="off"
                    />
                    {(form.mc_options || []).length > MIN_OPTS ? (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="shrink-0 self-start rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink-muted hover:bg-subtle hover:text-ink"
                      >
                        {t('admin.dashboard.mcRemoveOption')}
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
              {(form.mc_options || []).length < MAX_OPTS ? (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-4 rounded-xl border border-dashed border-line px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent-soft/40"
                >
                  {t('admin.dashboard.mcAddOption')}
                </button>
              ) : null}
            </div>

            <div className="rounded-2xl border border-line/80 bg-subtle/20 p-5 shadow-sm sm:p-6">
              <label htmlFor="mc-expl" className="text-base font-semibold text-ink">
                {t('admin.dashboard.optionalExplanationMc')}
              </label>
              <textarea
                id="mc-expl"
                rows={4}
                value={form.answer_sq}
                onChange={(e) => setForm((f) => ({ ...f, answer_sq: e.target.value }))}
                className={textareaClass}
                placeholder={t('admin.dashboard.placeholderExplanationMc')}
              />
            </div>
          </>
        )}
      </div>

      <footer className="flex shrink-0 flex-col-reverse gap-4 border-t border-line/80 bg-canvas/98 px-5 py-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-5">
        <p className="text-center text-sm text-ink-muted sm:text-left">{t('admin.dashboard.questionEditorFooterNoSort')}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-line bg-canvas px-7 py-3.5 text-base font-semibold text-ink shadow-sm transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('admin.dashboard.cancel')}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-10 py-3.5 text-base font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? t('admin.dashboard.saving') : t('admin.dashboard.save')}
          </button>
        </div>
      </footer>
    </form>
  );
}
