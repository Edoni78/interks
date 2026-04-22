import { FaClipboardList, FaFolderOpen, FaLayerGroup, FaSignOutAlt, FaStickyNote } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';

export function AdminSidebar({
  t,
  activeSection,
  setActiveSection,
  categories,
  categoryId,
  setCategoryId,
  labelForCategory,
  signOut,
  viewingQuestions,
  viewingCategories,
  viewingNotes,
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-canvas lg:flex">
      <div className="border-b border-line px-5 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <img src={logo} alt="" className="h-8 w-8 object-contain" width={32} height={32} />
          interks
        </Link>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-muted">{t('admin.dashboard.role')}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label={t('admin.dashboard.category')}>
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Menu</p>
        <button
          type="button"
          onClick={() => setActiveSection('questions')}
          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
            viewingQuestions
              ? 'border border-accent/30 bg-accent-soft/70 text-ink shadow-sm'
              : 'text-ink-muted hover:bg-subtle hover:text-ink'
          }`}
        >
          <FaClipboardList className="text-accent" aria-hidden />
          {t('admin.dashboard.questionsSection')}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('categories')}
          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
            viewingCategories
              ? 'border border-accent/30 bg-accent-soft/70 text-ink shadow-sm'
              : 'text-ink-muted hover:bg-subtle hover:text-ink'
          }`}
        >
          <FaFolderOpen className="text-accent" aria-hidden />
          {t('admin.dashboard.categoriesSection')}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('notes')}
          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
            viewingNotes
              ? 'border border-accent/30 bg-accent-soft/70 text-ink shadow-sm'
              : 'text-ink-muted hover:bg-subtle hover:text-ink'
          }`}
        >
          <FaStickyNote className="text-accent" aria-hidden />
          {t('admin.dashboard.notesSection')}
        </button>
        {viewingQuestions && (
          <>
            <p className="px-3 pt-3 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              {t('admin.dashboard.levels')}
            </p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                  categoryId === cat.id
                    ? 'border border-accent/30 bg-accent-soft/70 text-ink shadow-sm'
                    : 'text-ink-muted hover:bg-subtle hover:text-ink'
                }`}
              >
                <FaLayerGroup className="text-accent" aria-hidden />
                {labelForCategory(cat)}
              </button>
            ))}
          </>
        )}
      </nav>
      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line py-3 text-sm font-semibold text-ink transition hover:bg-subtle"
        >
          <FaSignOutAlt aria-hidden />
          {t('admin.dashboard.logout')}
        </button>
      </div>
    </aside>
  );
}
