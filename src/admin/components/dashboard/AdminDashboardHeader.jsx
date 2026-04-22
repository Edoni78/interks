import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function AdminDashboardHeader({
  t,
  signOut,
  activeCategory,
  labelForCategory,
  categories,
  categoryId,
  setCategoryId,
  setActiveSection,
  viewingQuestions,
  viewingCategories,
  viewingNotes,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="hidden rounded-full border border-line p-2.5 text-ink-muted transition hover:bg-subtle hover:text-ink sm:inline-flex"
            aria-label={t('admin.dashboard.backHome')}
          >
            <FaArrowLeft />
          </Link>
          <div className="min-w-0 lg:hidden">
            <p className="truncate font-display text-lg font-semibold text-ink">interks</p>
          </div>
          <div className="hidden min-w-0 lg:block">
            <h1 className="truncate font-display text-xl font-semibold text-ink">{t('admin.dashboard.title')}</h1>
            <p className="truncate text-sm text-ink-muted">
              {viewingNotes
                ? t('admin.dashboard.notesSection')
                : viewingCategories
                  ? t('admin.dashboard.categoriesSection')
                  : activeCategory
                    ? labelForCategory(activeCategory)
                    : '—'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={signOut}
            className="inline-flex rounded-full border border-line p-2.5 text-ink-muted transition hover:bg-subtle hover:text-ink lg:hidden"
            aria-label={t('admin.dashboard.logout')}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-line bg-subtle/50 px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setActiveSection('questions')}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            viewingQuestions ? 'bg-ink text-white' : 'bg-canvas text-ink-muted ring-1 ring-line'
          }`}
        >
          {t('admin.dashboard.questionsSection')}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('categories')}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            viewingCategories ? 'bg-ink text-white' : 'bg-canvas text-ink-muted ring-1 ring-line'
          }`}
        >
          {t('admin.dashboard.categoriesSection')}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('notes')}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            viewingNotes ? 'bg-ink text-white' : 'bg-canvas text-ink-muted ring-1 ring-line'
          }`}
        >
          {t('admin.dashboard.notesSection')}
        </button>
        {viewingQuestions &&
          categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                categoryId === cat.id ? 'bg-ink text-white' : 'bg-canvas text-ink-muted ring-1 ring-line'
              }`}
            >
              {labelForCategory(cat)}
            </button>
          ))}
      </div>
    </header>
  );
}
