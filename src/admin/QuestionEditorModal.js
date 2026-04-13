import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLightbulb, FaQuestion, FaTimes } from 'react-icons/fa';

const emptyForm = {
  question_sq: '',
  question_en: '',
  answer_sq: '',
  answer_en: '',
  sort_order: 0,
};

export function QuestionEditorModal({ open, initial, categoryId, onClose, onSave, saving }) {
  const { t } = useTranslation();
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

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initial?.id,
      category_id: categoryId,
      question_sq: form.question_sq.trim(),
      question_en: form.question_en.trim(),
      answer_sq: form.answer_sq.trim(),
      answer_en: form.answer_en.trim(),
      sort_order: Number(form.sort_order) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-editor-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-line/90 bg-canvas shadow-soft sm:rounded-3xl"
      >
        <div className="h-1 w-full bg-gradient-to-r from-accent via-accent/80 to-sun" aria-hidden />
        <div className="flex items-center justify-between border-b border-line/80 bg-subtle/40 px-6 py-4 sm:px-8">
          <div className="min-w-0 pr-3">
            <h2 id="question-editor-title" className="font-display text-xl font-semibold tracking-tight text-ink">
              {initial ? t('admin.dashboard.editQuestion') : t('admin.dashboard.addQuestion')}
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              {t('admin.dashboard.sectionQuestions')} · {t('admin.dashboard.sectionAnswers')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-transparent p-2.5 text-ink-muted transition hover:border-line hover:bg-canvas hover:text-ink"
            aria-label={t('admin.dashboard.cancel')}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
            <section className="rounded-2xl border border-line/80 bg-gradient-to-br from-sun/12 via-canvas to-canvas p-5 shadow-sm sm:p-6">
              <h3 className="flex items-center gap-3 font-display text-sm font-semibold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-accent shadow-sm ring-1 ring-line/60">
                  <FaQuestion className="text-base" aria-hidden />
                </span>
                {t('admin.dashboard.sectionQuestions')}
              </h3>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink/45">
                    {t('admin.dashboard.questionSq')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.question_sq}
                    onChange={(e) => setForm((f) => ({ ...f, question_sq: e.target.value }))}
                    className="mt-2 w-full resize-y rounded-xl border border-line bg-canvas/90 px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink/45">
                    {t('admin.dashboard.questionEn')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.question_en}
                    onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))}
                    className="mt-2 w-full resize-y rounded-xl border border-line bg-canvas/90 px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-line/80 bg-gradient-to-br from-accent-soft/60 via-canvas to-canvas p-5 shadow-sm sm:p-6">
              <h3 className="flex items-center gap-3 font-display text-sm font-semibold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-accent shadow-sm ring-1 ring-line/60">
                  <FaLightbulb className="text-base" aria-hidden />
                </span>
                {t('admin.dashboard.sectionAnswers')}
              </h3>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-accent">
                    {t('admin.dashboard.answerSq')}
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.answer_sq}
                    onChange={(e) => setForm((f) => ({ ...f, answer_sq: e.target.value }))}
                    className="mt-2 w-full resize-y rounded-xl border border-line bg-canvas/90 px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-accent">
                    {t('admin.dashboard.answerEn')}
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.answer_en}
                    onChange={(e) => setForm((f) => ({ ...f, answer_en: e.target.value }))}
                    className="mt-2 w-full resize-y rounded-xl border border-line bg-canvas/90 px-4 py-3 text-sm leading-relaxed text-ink shadow-sm outline-none transition placeholder:text-ink-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                </div>
              </div>
            </section>

            <div className="rounded-2xl border border-dashed border-line bg-subtle/50 px-5 py-4 sm:px-6">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                {t('admin.dashboard.sortOrder')}
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                className="mt-2 w-full max-w-[10rem] rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line/80 bg-canvas/95 px-6 py-4 backdrop-blur-sm sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-line bg-subtle/80 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-subtle"
            >
              {t('admin.dashboard.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:opacity-60"
            >
              {saving ? t('admin.dashboard.saving') : t('admin.dashboard.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
