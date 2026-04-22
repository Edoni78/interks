import { FaLightbulb, FaQuestion } from 'react-icons/fa';

const fieldClass =
  'mt-2 min-h-[7.5rem] w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20';

const answerFieldClass =
  'mt-2 min-h-[11rem] w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20';

export function QuestionEditorModalForm({ t, form, setForm, onSubmit, saving, onClose }) {
  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
        <section className="rounded-2xl border border-line/80 bg-canvas p-5 shadow-sm sm:p-6" aria-labelledby="qe-questions-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent ring-1 ring-line/50">
              <FaQuestion className="text-sm" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h3 id="qe-questions-heading" className="font-display text-sm font-semibold text-ink">
                {t('admin.dashboard.sectionQuestions')}
              </h3>
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="q-sq" className="text-xs font-semibold text-ink">
              {t('admin.dashboard.questionField')}
            </label>
            <textarea
              id="q-sq"
              required
              rows={6}
              value={form.question_sq}
              onChange={(e) => setForm((f) => ({ ...f, question_sq: e.target.value }))}
              className={fieldClass}
              placeholder={t('admin.dashboard.placeholderQuestion')}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-line/80 bg-canvas p-5 shadow-sm sm:p-6" aria-labelledby="qe-answers-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sun/25 text-ink ring-1 ring-line/50">
              <FaLightbulb className="text-sm" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h3 id="qe-answers-heading" className="font-display text-sm font-semibold text-ink">
                {t('admin.dashboard.sectionAnswers')}
              </h3>
              <p className="mt-0.5 text-xs text-ink-muted">{t('admin.dashboard.answerGuidance')}</p>
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="a-sq" className="text-xs font-semibold text-ink">
              {t('admin.dashboard.answerField')}
            </label>
            <textarea
              id="a-sq"
              required
              rows={8}
              value={form.answer_sq}
              onChange={(e) => setForm((f) => ({ ...f, answer_sq: e.target.value }))}
              className={answerFieldClass}
              placeholder={t('admin.dashboard.placeholderAnswer')}
            />
          </div>
        </section>
      </div>

      <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-line/80 bg-canvas/98 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-center text-xs text-ink-muted sm:text-left">{t('admin.dashboard.questionEditorFooterNoSort')}</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-line bg-canvas px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('admin.dashboard.cancel')}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? t('admin.dashboard.saving') : t('admin.dashboard.save')}
          </button>
        </div>
      </footer>
    </form>
  );
}
