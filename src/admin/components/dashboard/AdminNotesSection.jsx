import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { FaDownload, FaPen, FaPlus, FaStickyNote, FaTrash } from 'react-icons/fa';
import { downloadNoteAsHtml } from '../notes/downloadNoteHtml';
import { NoteRichTextEditor } from '../notes/NoteRichTextEditor';

const emptyForm = { title: '', body: '' };

const PURIFY_NOTE = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'span',
    'h1',
    'h2',
    'h3',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'hr',
    'a',
  ],
  ALLOWED_ATTR: ['style', 'class', 'href', 'target', 'rel', 'color'],
};

function sanitizeNoteHtml(html) {
  return DOMPurify.sanitize(html || '', PURIFY_NOTE);
}

export function AdminNotesSection({
  t,
  notes,
  notesLoading,
  loadError,
  noteModalOpen,
  setNoteModalOpen,
  editingNote,
  setEditingNote,
  onSaveNote,
  onDeleteNote,
  savingNote,
}) {
  const [form, setForm] = useState(emptyForm);
  const [draftSession, setDraftSession] = useState(0);

  const documentKey = editingNote?.id ?? `draft-${draftSession}`;

  useEffect(() => {
    if (editingNote) {
      setForm({
        title: editingNote.title || '',
        body: editingNote.body || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingNote, noteModalOpen]);

  const openNew = () => {
    setEditingNote(null);
    setForm(emptyForm);
    setDraftSession((n) => n + 1);
    setNoteModalOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setNoteModalOpen(true);
  };

  const closeModal = () => {
    if (savingNote) return;
    setNoteModalOpen(false);
    setEditingNote(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    await onSaveNote({
      id: editingNote?.id,
      title: form.title,
      body: form.body,
    });
  };

  const handleDownload = () => {
    const title = (form.title || '').trim() || t('admin.dashboard.newNote');
    downloadNoteAsHtml(title, sanitizeNoteHtml(form.body));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('admin.dashboard.notesEyebrow')}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{t('admin.dashboard.notesTitle')}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('admin.dashboard.notesSubtitle')}</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover"
        >
          <FaPlus aria-hidden />
          {t('admin.dashboard.addNote')}
        </button>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">{loadError}</div>
      )}

      {notesLoading && (
        <p className="rounded-2xl border border-line bg-canvas px-6 py-10 text-center text-ink-muted">{t('admin.dashboard.notesLoading')}</p>
      )}

      {!notesLoading && notes.length === 0 && !loadError && (
        <div className="rounded-3xl border border-dashed border-line bg-canvas/80 px-8 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <FaStickyNote className="text-xl" aria-hidden />
          </div>
          <p className="mx-auto max-w-md text-ink-muted">{t('admin.dashboard.notesEmpty')}</p>
          <button
            type="button"
            onClick={openNew}
            className="mt-6 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            {t('admin.dashboard.addNote')}
          </button>
        </div>
      )}

      {!notesLoading && notes.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex flex-col rounded-2xl border border-line bg-canvas p-5 shadow-sm transition hover:border-accent/25 hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-ink">{note.title || '—'}</h3>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(note)}
                    className="rounded-lg p-2 text-ink-muted transition hover:bg-subtle hover:text-ink"
                    aria-label={t('admin.dashboard.editNote')}
                  >
                    <FaPen className="text-sm" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(note.id)}
                    className="rounded-lg p-2 text-ink-muted transition hover:bg-red-50 hover:text-red-700"
                    aria-label={t('admin.dashboard.delete')}
                  >
                    <FaTrash className="text-sm" aria-hidden />
                  </button>
                </div>
              </div>
              {note.body ? (
                <div
                  className="note-preview-html mt-3 line-clamp-4 text-sm leading-relaxed text-ink-muted prose-headings:font-semibold"
                  dangerouslySetInnerHTML={{ __html: sanitizeNoteHtml(note.body) }}
                />
              ) : (
                <p className="mt-3 text-sm italic text-ink-muted">{t('admin.dashboard.noteNoBody')}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {noteModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="note-modal-title"
        >
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={closeModal} />
          <div className="relative z-10 flex max-h-[min(94vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-line bg-canvas shadow-soft sm:max-h-[92vh]">
            <div className="shrink-0 border-b border-line px-6 py-5 sm:px-8">
              <h2 id="note-modal-title" className="font-display text-xl font-semibold text-ink">
                {editingNote ? t('admin.dashboard.editNote') : t('admin.dashboard.newNote')}
              </h2>
              <p className="mt-1 text-xs text-ink-muted">{t('admin.dashboard.noteEditorIntro')}</p>
            </div>
            <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5 sm:px-8">
                <div>
                  <label htmlFor="note-title" className="block text-sm font-medium text-ink">
                    {t('admin.dashboard.noteTitle')}
                  </label>
                  <input
                    id="note-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">{t('admin.dashboard.noteBody')}</label>
                  <NoteRichTextEditor
                    key={documentKey}
                    initialBody={editingNote?.body || ''}
                    onChange={(html) => setForm((f) => ({ ...f, body: html }))}
                    placeholder={t('admin.dashboard.noteBodyPlaceholder')}
                    t={t}
                  />
                </div>
              </div>
              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-line bg-subtle/30 px-6 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-8">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={savingNote}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-canvas px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
                >
                  <FaDownload aria-hidden />
                  {t('admin.dashboard.noteDownloadHtml')}
                </button>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={savingNote}
                    className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
                  >
                    {t('admin.dashboard.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={savingNote}
                    className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover disabled:opacity-60"
                  >
                    {savingNote ? t('admin.dashboard.saving') : t('admin.dashboard.save')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
