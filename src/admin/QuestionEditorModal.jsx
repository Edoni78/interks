import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { QuestionEditorModalForm } from './QuestionEditorModalForm';

const emptyForm = {
  question_sq: '',
  question_en: '',
  answer_sq: '',
  answer_en: '',
};

export function QuestionEditorModal({ open, initial, categoryId, categoryLabel, onClose, onSave, saving }) {
  const { t } = useTranslation();
  const titleId = useId();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          question_sq: initial.question_sq || '',
          question_en: initial.question_en || '',
          answer_sq: initial.answer_sq || '',
          answer_en: initial.answer_en || '',
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
      question_en: questionSq,
      answer_sq: answerSq,
      answer_en: answerSq,
      sort_order: initial?.sort_order,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" role="presentation">
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
        className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-line/90 bg-canvas shadow-[0_24px_80px_-12px_rgba(15,23,42,0.25)] sm:rounded-3xl"
      >
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-accent via-accent/85 to-sun" aria-hidden />

        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line/80 bg-subtle/30 px-5 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{t('admin.dashboard.questionEditorEyebrow')}</p>
            <h2 id={titleId} className="mt-2 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {initial ? t('admin.dashboard.editQuestion') : t('admin.dashboard.addQuestion')}
            </h2>
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
            <FaTimes className="text-base" />
          </button>
        </header>

        <QuestionEditorModalForm
          t={t}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          saving={saving}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
