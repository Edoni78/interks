import DOMPurify from 'dompurify';
import { useCallback, useEffect, useState } from 'react';
import { FaBookOpen, FaFilePdf, FaPlus, FaStickyNote, FaTimes, FaTrash } from 'react-icons/fa';
import { downloadNoteAsPdf } from '../notes/downloadNotePdf';
import { NoteRichTextEditor } from '../notes/NoteRichTextEditor';
import '../notes/noteRichText.css';

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

function hasMeaningfulBody(html) {
  if (!html || !String(html).trim()) return false;
  const text = String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 0;
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
  const [readOnly, setReadOnly] = useState(false);
  const [pdfExporting, setPdfExporting] = useState(false);

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

  const closeModal = useCallback(() => {
    if (savingNote || pdfExporting) return;
    setNoteModalOpen(false);
    setEditingNote(null);
    setReadOnly(false);
  }, [savingNote, pdfExporting, setNoteModalOpen, setEditingNote]);

  useEffect(() => {
    if (!noteModalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !savingNote && !pdfExporting) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [noteModalOpen, savingNote, pdfExporting, closeModal]);

  const openNew = () => {
    setEditingNote(null);
    setForm(emptyForm);
    setDraftSession((n) => n + 1);
    setReadOnly(false);
    setNoteModalOpen(true);
  };

  /** Opens note in edit mode (rich editor). */
  const openEdit = (note) => {
    setEditingNote(note);
    setReadOnly(false);
    setNoteModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    await onSaveNote({
      id: editingNote?.id,
      title: form.title,
      body: form.body,
    });
  };

  const runPdfDownload = useCallback(async () => {
    const title = (form.title || '').trim() || t('admin.dashboard.newNote');
    const html = sanitizeNoteHtml(form.body);
    setPdfExporting(true);
    try {
      await downloadNoteAsPdf(title, html);
    } catch (err) {
      console.error(err);
      window.alert(t('admin.dashboard.notePdfError'));
    } finally {
      setPdfExporting(false);
    }
  }, [form.body, form.title, t]);

  const previewHtml = sanitizeNoteHtml(form.body);
  const hasBody = hasMeaningfulBody(form.body);

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
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex flex-col rounded-2xl border border-line bg-canvas p-5 shadow-sm transition hover:border-accent/25 hover:shadow-card"
            >
              <h3 className="font-display text-lg font-semibold leading-snug text-ink">{note.title || '—'}</h3>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openEdit(note)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-subtle"
                >
                  {t('admin.dashboard.noteOpen')}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note.id)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm font-medium text-ink-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:max-w-[8rem] sm:flex-none"
                  aria-label={t('admin.dashboard.delete')}
                >
                  <FaTrash aria-hidden />
                  {t('admin.dashboard.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {noteModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex w-full min-w-0 flex-col bg-canvas"
          role="dialog"
          aria-modal="true"
          aria-labelledby="note-modal-title"
        >
          <header className="flex w-full min-w-0 shrink-0 items-center justify-between gap-3 border-b border-line bg-canvas px-4 py-3 sm:px-6">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {readOnly ? t('admin.dashboard.noteReadBadge') : t('admin.dashboard.notesEyebrow')}
              </p>
              <h2 id="note-modal-title" className="truncate font-display text-lg font-semibold text-ink sm:text-xl">
                {readOnly ? form.title || '—' : editingNote ? t('admin.dashboard.editNote') : t('admin.dashboard.newNote')}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => setReadOnly(true)}
                  disabled={savingNote || pdfExporting}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-2 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
                >
                  <FaBookOpen className="text-accent" aria-hidden />
                  <span className="hidden sm:inline">{t('admin.dashboard.noteReadMode')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={runPdfDownload}
                disabled={pdfExporting || (!readOnly && savingNote)}
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-2 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
              >
                <FaFilePdf className="text-red-600/90" aria-hidden />
                <span className="hidden sm:inline">{pdfExporting ? t('admin.dashboard.notePdfWorking') : t('admin.dashboard.noteDownloadPdf')}</span>
              </button>
              <button
                type="button"
                onClick={closeModal}
                disabled={savingNote || pdfExporting}
                className="rounded-lg border border-line p-2.5 text-ink-muted transition hover:bg-subtle hover:text-ink disabled:opacity-50"
                aria-label={t('admin.dashboard.closeDialog')}
              >
                <FaTimes className="text-lg" aria-hidden />
              </button>
            </div>
          </header>

          {readOnly ? (
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
              <div className="relative min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-subtle/60 via-canvas to-subtle/30">
                <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
                  <article className="overflow-hidden rounded-2xl border border-line/90 bg-canvas shadow-[0_24px_70px_-20px_rgba(15,23,42,0.18)] ring-1 ring-ink/[0.04]">
                    <div className="border-b border-line/70 bg-subtle/25 px-6 py-6 sm:px-10 sm:py-8">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">{t('admin.dashboard.noteReadBadge')}</p>
                      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{form.title || '—'}</h1>
                      <p className="mt-2 text-sm text-ink-muted">{t('admin.dashboard.noteReadIntro')}</p>
                    </div>
                    <div className="px-6 py-8 sm:px-10 sm:py-10">
                      {hasBody ? (
                        <div
                          className="note-modal-preview note-read-body text-base leading-relaxed text-ink"
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                      ) : (
                        <p className="text-center text-ink-muted">{t('admin.dashboard.noteNoBody')}</p>
                      )}
                    </div>
                  </article>
                </div>
              </div>
              <footer className="flex w-full shrink-0 flex-wrap gap-2 border-t border-line bg-canvas px-4 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setReadOnly(false)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover sm:flex-none sm:px-8"
                >
                  {t('admin.dashboard.noteEditFromRead')}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={pdfExporting}
                  className="rounded-lg border border-line bg-canvas px-6 py-3 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
                >
                  {t('admin.dashboard.cancel')}
                </button>
              </footer>
            </div>
          ) : (
            <form onSubmit={submit} className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
              <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col lg:flex-row lg:divide-x lg:divide-line">
                <div className="flex min-h-[45vh] w-full min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0 lg:w-1/2">
                  <div className="w-full shrink-0 space-y-3 border-b border-line px-4 py-4 sm:px-6">
                    <label htmlFor="note-title" className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      {t('admin.dashboard.noteTitle')}
                    </label>
                    <input
                      id="note-title"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      required
                    />
                  </div>
                  <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col px-4 py-4 sm:px-6 sm:py-5">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      {t('admin.dashboard.noteBody')}
                    </label>
                    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
                      <NoteRichTextEditor
                        key={documentKey}
                        fullSize
                        initialBody={editingNote?.body || ''}
                        onChange={(html) => setForm((f) => ({ ...f, body: html }))}
                        placeholder={t('admin.dashboard.noteBodyPlaceholder')}
                        t={t}
                      />
                    </div>
                  </div>
                </div>
                <aside className="flex min-h-[200px] w-full min-w-0 shrink-0 flex-col border-t border-line bg-subtle/20 lg:min-h-0 lg:w-1/2 lg:border-t-0">
                  <p className="w-full shrink-0 border-b border-line/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted sm:px-6">
                    {t('admin.dashboard.notePreviewLive')}
                  </p>
                  <div className="min-h-0 w-full flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                    {hasBody ? (
                      <div className="note-live-preview text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    ) : (
                      <p className="text-sm italic text-ink-muted">{t('admin.dashboard.notePreviewEmpty')}</p>
                    )}
                  </div>
                </aside>
              </div>
              <footer className="flex w-full shrink-0 flex-col-reverse gap-2 border-t border-line bg-subtle/30 px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={savingNote || pdfExporting}
                  className="rounded-lg border border-line bg-canvas px-5 py-3 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
                >
                  {t('admin.dashboard.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingNote || pdfExporting}
                  className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover disabled:opacity-60"
                >
                  {savingNote ? t('admin.dashboard.saving') : t('admin.dashboard.save')}
                </button>
              </footer>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
