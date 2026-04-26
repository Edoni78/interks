import { useState } from 'react';
import { FaBook, FaPlus } from 'react-icons/fa';
import { AdminQuestionsEmpty } from './AdminQuestionCard';
import { AdminQuestionsTable } from './AdminQuestionsTable';
import { AdminQuestionStudyOverlay } from './AdminQuestionStudyOverlay';

export function AdminQuestionsSection({
  t,
  categoryId,
  questions,
  loadError,
  activeCategory,
  labelForCategory,
  setEditing,
  setModalOpen,
  onDelete,
}) {
  const [studyOpen, setStudyOpen] = useState(false);
  const [studyStartIndex, setStudyStartIndex] = useState(0);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openStudyAt = (index) => {
    setStudyStartIndex(index);
    setStudyOpen(true);
  };

  const categoryLabel = activeCategory ? labelForCategory(activeCategory) : '';

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="lg:hidden">
          <h1 className="font-display text-2xl font-semibold text-ink">{t('admin.dashboard.title')}</h1>
          <p className="mt-1 text-sm text-ink-muted">{categoryLabel || '—'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryId && questions.length > 0 && (
            <button
              type="button"
              onClick={() => openStudyAt(0)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-canvas px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-subtle"
            >
              <FaBook aria-hidden />
              {t('admin.dashboard.startLearningSession')}
            </button>
          )}
          <button
            type="button"
            onClick={openNew}
            disabled={!categoryId}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:opacity-50"
          >
            <FaPlus aria-hidden />
            {t('admin.dashboard.addQuestion')}
          </button>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">{loadError}</div>
      )}

      {categoryId && questions.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-line/80 pb-6">
          <span className="text-sm font-semibold text-ink">{categoryLabel || '—'}</span>
          <span className="text-sm text-ink-muted">{t('admin.dashboard.inThisLevel', { count: questions.length })}</span>
        </div>
      )}

      {!categoryId && !loadError && (
        <p className="rounded-2xl border border-line bg-canvas px-6 py-10 text-center text-ink-muted">{t('admin.dashboard.noCategories')}</p>
      )}

      {categoryId && questions.length === 0 && !loadError && <AdminQuestionsEmpty t={t} onAdd={openNew} />}

      {categoryId && questions.length > 0 && (
        <AdminQuestionsTable
          questions={questions}
          t={t}
          onStartStudy={openStudyAt}
          onEdit={(q) => {
            setEditing(q);
            setModalOpen(true);
          }}
          onDelete={onDelete}
        />
      )}

      <AdminQuestionStudyOverlay
        open={studyOpen}
        questions={questions}
        startIndex={studyStartIndex}
        categoryId={categoryId}
        categoryLabel={categoryLabel}
        t={t}
        onClose={() => setStudyOpen(false)}
      />
    </div>
  );
}
