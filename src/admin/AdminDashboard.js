import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaLayerGroup,
  FaPen,
  FaPlus,
  FaSignOutAlt,
  FaTrash,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import logo from '../assets/logo.png';
import { QuestionEditorModal } from './QuestionEditorModal';

export function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedAnswerId, setExpandedAnswerId] = useState(null);

  const labelForCategory = useCallback(
    (cat) => {
      if (!cat) return '';
      return i18n.language.startsWith('en') ? cat.label_en : cat.label_sq;
    },
    [i18n.language],
  );

  const loadCategories = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoadError(t('admin.login.configError'));
      return;
    }
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (error) {
      setLoadError(error.message);
      return;
    }
    setCategories(data || []);
    setCategoryId((prev) => prev || data?.[0]?.id || null);
  }, [t]);

  const loadQuestions = useCallback(async () => {
    if (!categoryId) return;
    setLoadError('');
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      setLoadError(error.message);
      setQuestions([]);
      return;
    }
    setQuestions(data || []);
  }, [categoryId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('en') ? 'sq' : 'en');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const onSaveQuestion = async (payload) => {
    setSaving(true);
    setLoadError('');
    try {
      if (payload.id) {
        const { error } = await supabase
          .from('questions')
          .update({
            question_sq: payload.question_sq,
            question_en: payload.question_en,
            answer_sq: payload.answer_sq,
            answer_en: payload.answer_en,
            sort_order: payload.sort_order,
          })
          .eq('id', payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('questions').insert({
          category_id: payload.category_id,
          question_sq: payload.question_sq,
          question_en: payload.question_en,
          answer_sq: payload.answer_sq,
          answer_en: payload.answer_en,
          sort_order: payload.sort_order,
        });
        if (error) throw error;
      }
      setModalOpen(false);
      setEditing(null);
      await loadQuestions();
    } catch (err) {
      setLoadError(err.message || t('admin.dashboard.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm(t('admin.dashboard.confirmDelete'))) return;
    setLoadError('');
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) {
      setLoadError(error.message);
      return;
    }
    await loadQuestions();
  };

  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="min-h-screen bg-subtle">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-canvas lg:flex">
          <div className="border-b border-line px-5 py-6">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <img src={logo} alt="" className="h-8 w-8 object-contain" width={32} height={32} />
              interks
            </Link>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-muted">{t('admin.dashboard.role')}</p>
          </div>
          <nav className="flex-1 space-y-1 p-3" aria-label={t('admin.dashboard.category')}>
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t('admin.dashboard.levels')}
            </p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                  categoryId === cat.id
                    ? 'bg-ink text-white shadow-card'
                    : 'text-ink-muted hover:bg-subtle hover:text-ink'
                }`}
              >
                <FaLayerGroup className={categoryId === cat.id ? 'text-sun' : 'text-accent'} aria-hidden />
                {labelForCategory(cat)}
              </button>
            ))}
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

        <div className="flex min-w-0 flex-1 flex-col">
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
                    {activeCategory ? labelForCategory(activeCategory) : '—'}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLang}
                  className="flex items-center gap-2 rounded-full border border-line bg-subtle/80 px-3 py-2 text-xs font-semibold text-ink transition hover:bg-subtle"
                >
                  <FaGlobe className="text-accent" aria-hidden />
                  {i18n.language.startsWith('en') ? 'SQ' : 'EN'}
                </button>
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
              {categories.map((cat) => (
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

          <main className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.55]"
              aria-hidden
            >
              <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-accent-soft blur-3xl" />
              <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-sun/25 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-4xl lg:max-w-5xl">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="lg:hidden">
                  <h1 className="font-display text-2xl font-semibold text-ink">{t('admin.dashboard.title')}</h1>
                  <p className="mt-1 text-sm text-ink-muted">
                    {activeCategory ? labelForCategory(activeCategory) : '—'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setModalOpen(true);
                  }}
                  disabled={!categoryId}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:opacity-50"
                >
                  <FaPlus aria-hidden />
                  {t('admin.dashboard.addQuestion')}
                </button>
              </div>

              {categoryId && questions.length > 0 && (
                <div className="mb-8 flex flex-wrap items-center gap-3 rounded-3xl border border-line/80 bg-canvas/90 px-5 py-4 shadow-card backdrop-blur-sm">
                  <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    {activeCategory ? labelForCategory(activeCategory) : '—'}
                  </span>
                  <span className="text-sm font-medium text-ink-muted">
                    {t('admin.dashboard.inThisLevel', { count: questions.length })}
                  </span>
                </div>
              )}

              {loadError && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
                  {loadError}
                </div>
              )}

              {!categoryId && !loadError && (
                <p className="rounded-2xl border border-line bg-canvas px-6 py-10 text-center text-ink-muted">
                  {t('admin.dashboard.noCategories')}
                </p>
              )}

              {categoryId && questions.length === 0 && !loadError && (
                <div className="rounded-3xl border border-dashed border-accent/25 bg-gradient-to-br from-canvas via-canvas to-accent-soft/40 px-8 py-16 text-center shadow-card">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-2xl text-accent shadow-sm">
                    <FaLayerGroup aria-hidden />
                  </div>
                  <p className="mx-auto max-w-sm text-base leading-relaxed text-ink-muted">{t('admin.dashboard.empty')}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setModalOpen(true);
                    }}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-sun px-7 py-3.5 text-sm font-semibold text-ink shadow-soft transition hover:brightness-95"
                  >
                    <FaPlus aria-hidden />
                    {t('admin.dashboard.addQuestion')}
                  </button>
                </div>
              )}

              <ul className="space-y-5">
                {questions.map((q, index) => {
                  const answersOpen = expandedAnswerId === q.id;
                  return (
                    <li
                      key={q.id}
                      className="group relative overflow-hidden rounded-3xl border border-line/90 bg-canvas/95 shadow-card backdrop-blur-sm transition hover:border-accent/20 hover:shadow-soft"
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent via-accent/70 to-sun opacity-90"
                        aria-hidden
                      />
                      <div className="p-6 pl-7 sm:p-7 sm:pl-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 flex-1 items-start gap-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-sm font-semibold text-white shadow-sm">
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1 space-y-4">
                              <div>
                                <h3 className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                                  {t('admin.dashboard.sectionQuestions')}
                                </h3>
                                <div className="mt-3 grid gap-3 md:grid-cols-2">
                                  <div className="rounded-2xl border border-line/80 bg-sun/10 p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                                      {t('admin.dashboard.previewSq')}
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                                      {q.question_sq || '—'}
                                    </p>
                                  </div>
                                  <div className="rounded-2xl border border-line/80 bg-accent-soft/80 p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                                      {t('admin.dashboard.previewEn')}
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                                      {q.question_en || '—'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <button
                                  type="button"
                                  onClick={() => setExpandedAnswerId(answersOpen ? null : q.id)}
                                  className="inline-flex items-center gap-2 rounded-full border border-line bg-subtle/80 px-4 py-2 text-xs font-semibold text-ink transition hover:border-accent/30 hover:bg-accent-soft/50"
                                  aria-expanded={answersOpen}
                                >
                                  {answersOpen ? (
                                    <>
                                      <FaChevronUp className="text-accent" aria-hidden />
                                      {t('admin.dashboard.hideAnswers')}
                                    </>
                                  ) : (
                                    <>
                                      <FaChevronDown className="text-accent" aria-hidden />
                                      {t('admin.dashboard.showAnswers')}
                                    </>
                                  )}
                                </button>
                                {answersOpen && (
                                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    <div className="rounded-2xl border border-line/80 bg-subtle p-4">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                                        {t('admin.dashboard.answerSq')}
                                      </p>
                                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                                        {q.answer_sq || '—'}
                                      </p>
                                    </div>
                                    <div className="rounded-2xl border border-line/80 bg-subtle p-4">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                                        {t('admin.dashboard.answerEn')}
                                      </p>
                                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                                        {q.answer_en || '—'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2 sm:flex-col sm:pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditing(q);
                                setModalOpen(true);
                              }}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-canvas px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/25 hover:bg-accent-soft/40 sm:flex-none"
                            >
                              <FaPen className="text-accent" aria-hidden />
                              {t('admin.dashboard.edit')}
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(q.id)}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-100 bg-canvas px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 sm:flex-none"
                            >
                              <FaTrash aria-hidden />
                              {t('admin.dashboard.delete')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </main>
        </div>
      </div>

      <QuestionEditorModal
        open={modalOpen}
        initial={editing}
        categoryId={categoryId}
        saving={saving}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditing(null);
          }
        }}
        onSave={onSaveQuestion}
      />
    </div>
  );
}
