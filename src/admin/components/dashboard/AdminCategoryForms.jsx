export function AdminCategoryForms({
  t,
  newCategory,
  setNewCategory,
  editCategory,
  setEditCategory,
  activeCategory,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  savingCategory,
  updatingCategory,
  deletingCategory,
}) {
  return (
    <>
      <form
        onSubmit={onCreateCategory}
        className="mb-8 rounded-3xl border border-line/80 bg-canvas/95 p-5 shadow-card backdrop-blur-sm sm:p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('admin.dashboard.addCategory')}</p>
        <div className="mt-4 max-w-xl">
          <label className="text-xs font-semibold text-ink-muted">
            {t('admin.dashboard.categoryName')}
            <input
              type="text"
              required
              value={newCategory.label_sq}
              onChange={(e) => setNewCategory((f) => ({ ...f, label_sq: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={savingCategory}
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:opacity-60"
          >
            {savingCategory ? t('admin.dashboard.saving') : t('admin.dashboard.addCategory')}
          </button>
        </div>
      </form>

      {activeCategory && (
        <form
          onSubmit={onUpdateCategory}
          className="mb-8 rounded-3xl border border-line/80 bg-canvas/95 p-5 shadow-card backdrop-blur-sm sm:p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('admin.dashboard.editCategory')}</p>
          <div className="mt-4 max-w-xl">
            <label className="text-xs font-semibold text-ink-muted">
              {t('admin.dashboard.categoryName')}
              <input
                type="text"
                required
                value={editCategory.label_sq}
                onChange={(e) => setEditCategory((f) => ({ ...f, label_sq: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onDeleteCategory}
              disabled={deletingCategory}
              className="inline-flex items-center justify-center rounded-full border border-red-100 bg-canvas px-5 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 disabled:opacity-60"
            >
              {t('admin.dashboard.deleteCategory')}
            </button>
            <button
              type="submit"
              disabled={updatingCategory}
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:opacity-60"
            >
              {updatingCategory ? t('admin.dashboard.saving') : t('admin.dashboard.updateCategory')}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
