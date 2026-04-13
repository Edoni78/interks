import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

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
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-3xl border border-line bg-canvas shadow-soft sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4 sm:px-8">
          <h2 id="question-editor-title" className="font-display text-xl font-semibold text-ink">
            {initial ? t('admin.dashboard.editQuestion') : t('admin.dashboard.addQuestion')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-muted transition hover:bg-subtle hover:text-ink"
            aria-label={t('admin.dashboard.cancel')}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-sun">
                  {t('admin.dashboard.questionSq')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.question_sq}
                  onChange={(e) => setForm((f) => ({ ...f, question_sq: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-line bg-subtle/40 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-sun">
                  {t('admin.dashboard.questionEn')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.question_en}
                  onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-line bg-subtle/40 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-accent">
                  {t('admin.dashboard.answerSq')}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.answer_sq}
                  onChange={(e) => setForm((f) => ({ ...f, answer_sq: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-line bg-subtle/40 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-accent">
                  {t('admin.dashboard.answerEn')}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.answer_en}
                  onChange={(e) => setForm((f) => ({ ...f, answer_en: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-line bg-subtle/40 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {t('admin.dashboard.sortOrder')}
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line bg-subtle/30 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-line bg-canvas px-6 py-3 text-sm font-semibold text-ink transition hover:bg-subtle"
            >
              {t('admin.dashboard.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover disabled:opacity-60"
            >
              {saving ? t('admin.dashboard.saving') : t('admin.dashboard.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
