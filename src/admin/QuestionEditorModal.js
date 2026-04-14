import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLightbulb, FaQuestion, FaTimes } from 'react-icons/fa';

const emptyForm = {
  question_sq: '',
  question_en: '',
  answer_sq: '',
  answer_en: '',
  sort_order: 0,
};

const fieldClass =
  'mt-2 min-h-[7.5rem] w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20';

const answerFieldClass =
  'mt-2 min-h-[11rem] w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20';

export function QuestionEditorModal({ open, initial, categoryId, categoryLabel, onClose, onSave, saving }) {
  const { t } = useTranslation();
  const titleId = useId();
  const descId = useId();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          question_sq: initial.question_sq || '',
          question_en: initial.question_en || '',
          answer_sq: initial.answer_sq || '',
          answer_en: initial.answer_en || '',
          sort_order: initial.sort_order ?? 0,
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, saving, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionSq = form.question_sq.trim();
    const answerSq = form.answer_sq.trim();
    if (!questionSq || !answerSq) return;
    onSave({
      id: initial?.id,
      category_id: categoryId,
      question_sq: questionSq,
      question_en: form.question_en.trim(),
      answer_sq: answerSq,
      answer_en: form.answer_en.trim(),
      sort_order: Number(form.sort_order) || 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        aria-label={t('admin.dashboard.closeDialog')}
        onClick={() => {
          if (!saving) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-line/90 bg-canvas shadow-[0_24px_80px_-12px_rgba(15,23,42,0.25)] sm:rounded-3xl"
      >
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-accent via-accent/85 to-sun" aria-hidden />

        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line/80 bg-subtle/30 px-5 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              {t('admin.dashboard.questionEditorEyebrow')}
            </p>
            <h2 id={titleId} className="mt-2 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {initial ? t('admin.dashboard.editQuestion') : t('admin.dashboard.addQuestion')}
            </h2>
            <p id={descId} className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              {t('admin.dashboard.questionEditorSubtitle')}
            </p>
            {categoryLabel ? (
              <p className="mt-4">
                <span className="inline-flex items-center rounded-full border border-line/90 bg-canvas px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                  {categoryLabel}
                </span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="shrink-0 rounded-full border border-line/80 bg-canvas p-2.5 text-ink-muted shadow-sm transition hover:border-line hover:bg-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t('admin.dashboard.closeDialog')}
          >
            <FaTimes className="text-base" aria-hidden />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
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
                  <p className="mt-0.5 text-xs text-ink-muted">{t('admin.dashboard.bilingualPair')}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-8">
                <div className="rounded-xl border border-line/60 bg-subtle/20 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="q-sq" className="text-xs font-semibold text-ink">
                      {t('admin.dashboard.questionSq')}
                    </label>
                    <span className="rounded-md bg-ink/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      SQ
                    </span>
                  </div>
                  <textarea
                    id="q-sq"
                    required
                    rows={5}
                    value={form.question_sq}
                    onChange={(e) => setForm((f) => ({ ...f, question_sq: e.target.value }))}
                    className={fieldClass}
                    placeholder={t('admin.dashboard.placeholderQuestion')}
                  />
                </div>
                <div className="rounded-xl border border-line/60 bg-subtle/20 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="q-en" className="text-xs font-semibold text-ink">
                      {t('admin.dashboard.questionEn')}
                    </label>
                    <span className="flex items-center gap-1.5">
                      <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                        EN
                      </span>
                      <span className="rounded-md border border-line/80 bg-canvas px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                        {t('admin.dashboard.optional')}
                      </span>
                    </span>
                  </div>
                  <textarea
                    id="q-en"
                    rows={5}
                    value={form.question_en}
                    onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))}
                    className={fieldClass}
                    placeholder={t('admin.dashboard.placeholderQuestion')}
                  />
                </div>
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
              <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-8">
                <div className="rounded-xl border border-line/60 bg-subtle/20 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="a-sq" className="text-xs font-semibold text-ink">
                      {t('admin.dashboard.answerSq')}
                    </label>
                    <span className="rounded-md bg-ink/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      SQ
                    </span>
                  </div>
                  <textarea
                    id="a-sq"
                    required
                    rows={7}
                    value={form.answer_sq}
                    onChange={(e) => setForm((f) => ({ ...f, answer_sq: e.target.value }))}
                    className={answerFieldClass}
                    placeholder={t('admin.dashboard.placeholderAnswer')}
                  />
                </div>
                <div className="rounded-xl border border-line/60 bg-subtle/20 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="a-en" className="text-xs font-semibold text-ink">
                      {t('admin.dashboard.answerEn')}
                    </label>
                    <span className="flex items-center gap-1.5">
                      <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                        EN
                      </span>
                      <span className="rounded-md border border-line/80 bg-canvas px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                        {t('admin.dashboard.optional')}
                      </span>
                    </span>
                  </div>
                  <textarea
                    id="a-en"
                    rows={7}
                    value={form.answer_en}
                    onChange={(e) => setForm((f) => ({ ...f, answer_en: e.target.value }))}
                    className={answerFieldClass}
                    placeholder={t('admin.dashboard.placeholderAnswer')}
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 rounded-2xl border border-line/70 bg-subtle/25 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
              <div>
                <label htmlFor="sort-order" className="text-xs font-semibold text-ink">
                  {t('admin.dashboard.sortOrder')}
                </label>
                <p className="mt-1 text-xs text-ink-muted">{t('admin.dashboard.sortOrderHint')}</p>
              </div>
              <input
                id="sort-order"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 sm:w-28 sm:text-center"
              />
            </div>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-line/80 bg-canvas/98 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-center text-xs text-ink-muted sm:text-left">{t('admin.dashboard.questionEditorFooter')}</p>
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
      </div>
    </div>
  );
}
