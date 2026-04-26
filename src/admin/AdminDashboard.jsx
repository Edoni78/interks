import { useAdminDashboard } from './hooks/useAdminDashboard';
import { QuestionEditorModal } from './QuestionEditorModal';
import { AdminCategoryForms } from './components/dashboard/AdminCategoryForms';
import { AdminDashboardBackground } from './components/dashboard/AdminDashboardBackground';
import { AdminDashboardHeader } from './components/dashboard/AdminDashboardHeader';
import { AdminNotesSection } from './components/dashboard/AdminNotesSection';
import { AdminQuestionsSection } from './components/dashboard/AdminQuestionsSection';
import { AdminProgressSection } from './components/dashboard/AdminProgressSection';
import { AdminSidebar } from './components/dashboard/AdminSidebar';

export function AdminDashboard() {
  const d = useAdminDashboard();

  return (
    <div className="min-h-screen w-full min-w-0 bg-subtle">
      <div className="flex min-h-screen w-full min-w-0">
        <AdminSidebar
          t={d.t}
          setActiveSection={d.setActiveSection}
          categories={d.categories}
          categoryId={d.categoryId}
          setCategoryId={d.setCategoryId}
          labelForCategory={d.labelForCategory}
          signOut={d.signOut}
          viewingQuestions={d.viewingQuestions}
          viewingCategories={d.viewingCategories}
          viewingNotes={d.viewingNotes}
          viewingProgress={d.viewingProgress}
        />

        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
          <AdminDashboardHeader
            t={d.t}
            viewingNotes={d.viewingNotes}
            viewingCategories={d.viewingCategories}
            activeCategory={d.activeCategory}
            labelForCategory={d.labelForCategory}
            viewingQuestions={d.viewingQuestions}
            viewingProgress={d.viewingProgress}
          />

          <main className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
            <AdminDashboardBackground />
            <div
              className={
                d.viewingQuestions || d.viewingProgress
                  ? 'relative mx-auto w-full max-w-none'
                  : 'relative mx-auto max-w-4xl lg:max-w-5xl'
              }
            >
              {d.viewingProgress && (
                <AdminProgressSection t={d.t} categories={d.categories} labelForCategory={d.labelForCategory} />
              )}

              {d.viewingNotes && (
                <AdminNotesSection
                  t={d.t}
                  notes={d.notes}
                  notesLoading={d.notesLoading}
                  loadError={d.loadError}
                  noteModalOpen={d.noteModalOpen}
                  setNoteModalOpen={d.setNoteModalOpen}
                  editingNote={d.editingNote}
                  setEditingNote={d.setEditingNote}
                  onSaveNote={d.onSaveNote}
                  onDeleteNote={d.onDeleteNote}
                  savingNote={d.savingNote}
                />
              )}

              {(d.viewingCategories || d.viewingQuestions) && !d.viewingProgress && (
                <>
                  {d.viewingCategories && (
                    <AdminCategoryForms
                      t={d.t}
                      newCategory={d.newCategory}
                      setNewCategory={d.setNewCategory}
                      editCategory={d.editCategory}
                      setEditCategory={d.setEditCategory}
                      activeCategory={d.activeCategory}
                      onCreateCategory={d.onCreateCategory}
                      onUpdateCategory={d.onUpdateCategory}
                      onDeleteCategory={d.onDeleteCategory}
                      savingCategory={d.savingCategory}
                      updatingCategory={d.updatingCategory}
                      deletingCategory={d.deletingCategory}
                    />
                  )}

                  {d.viewingCategories && d.loadError && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">{d.loadError}</div>
                  )}

                  {d.viewingQuestions && (
                    <AdminQuestionsSection
                      t={d.t}
                      categoryId={d.categoryId}
                      questions={d.questions}
                      loadError={d.loadError}
                      activeCategory={d.activeCategory}
                      labelForCategory={d.labelForCategory}
                      setEditing={d.setEditing}
                      setModalOpen={d.setModalOpen}
                      onDelete={d.onDelete}
                    />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <QuestionEditorModal
        open={d.modalOpen}
        initial={d.editing}
        categoryId={d.categoryId}
        categoryLabel={d.activeCategory ? d.labelForCategory(d.activeCategory) : ''}
        saving={d.saving}
        onClose={() => {
          if (!d.saving) {
            d.setModalOpen(false);
            d.setEditing(null);
          }
        }}
        onSave={d.onSaveQuestion}
      />
    </div>
  );
}
