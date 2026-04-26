import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function AdminDashboardHeader({
  t,
  activeCategory,
  labelForCategory,
  viewingQuestions,
  viewingCategories,
  viewingNotes,
  viewingProgress,
}) {
  return (
    <header className="sticky top-0 z-40 w-full min-w-0 border-b border-line bg-canvas/95 backdrop-blur-md">
      <div className="flex w-full min-w-0 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            to="/"
            className="inline-flex shrink-0 rounded-full border border-line p-2.5 text-ink-muted transition hover:bg-subtle hover:text-ink"
            aria-label={t('admin.dashboard.backHome')}
          >
            <FaArrowLeft />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-semibold text-ink sm:text-xl">{t('admin.dashboard.title')}</h1>
            <p className="truncate text-xs text-ink-muted sm:text-sm">
              {viewingProgress
                ? t('admin.dashboard.progressSection')
                : viewingNotes
                  ? t('admin.dashboard.notesSection')
                  : viewingCategories
                    ? t('admin.dashboard.categoriesSection')
                    : viewingQuestions && activeCategory
                      ? labelForCategory(activeCategory)
                      : '—'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
