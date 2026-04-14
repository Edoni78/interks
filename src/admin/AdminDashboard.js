import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaArrowLeft,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaFolderOpen,
  FaGlobe,
  FaInbox,
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
  const [savingCategory, setSavingCategory] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [submissionPending, setSubmissionPending] = useState([]);
  const [submissionApproved, setSubmissionApproved] = useState([]);
  const [submissionDeclined, setSubmissionDeclined] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionActionId, setSubmissionActionId] = useState(null);
  const [submissionTab, setSubmissionTab] = useState('pending');
  const [activeSection, setActiveSection] = useState('questions');
  const [expandedAnswerId, setExpandedAnswerId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    label_sq: '',
    label_en: '',
    slug: '',
    sort_order: '',
  });
  const [editCategory, setEditCategory] = useState({
    label_sq: '',
    label_en: '',
    slug: '',
    sort_order: '',
  });

  const labelForCategory = useCallback(
    (cat) => {
      if (!cat) return '';
      return i18n.language.startsWith('en') ? cat.label_en : cat.label_sq;
    },
    [i18n.language],
  );

  const sanitizeSlug = useCallback(
    (value) =>
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, ''),
    [],
  );

  const activeCategory = categories.find((c) => c.id === categoryId);
  const viewingQuestions = activeSection === 'questions';
  const viewingCategories = activeSection === 'categories';
  const viewingSubmissions = activeSection === 'submissions';

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
    const nextCategories = data || [];
    setCategories(nextCategories);
    setCategoryId((prev) => (nextCategories.some((c) => c.id === prev) ? prev : nextCategories[0]?.id || null));
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

  const loadSubmissions = useCallback(async () => {
    setSubmissionsLoading(true);
    const [pendingRes, approvedRes, declinedRes] = await Promise.all([
      supabase.from('question_submissions').select('*').eq('status', 'pending').order('created_at', { ascending: true }),
      supabase
        .from('question_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('reviewed_at', { ascending: false })
        .limit(200),
      supabase
        .from('question_submissions')
        .select('*')
        .eq('status', 'declined')
        .order('reviewed_at', { ascending: false })
        .limit(200),
    ]);
    const err = pendingRes.error || approvedRes.error || declinedRes.error;
    if (err) {
      setLoadError(err.message);
      setSubmissionPending([]);
      setSubmissionApproved([]);
      setSubmissionDeclined([]);
      setSubmissionsLoading(false);
      return;
    }
    setSubmissionPending(pendingRes.data || []);
    setSubmissionApproved(approvedRes.data || []);
    setSubmissionDeclined(declinedRes.data || []);
    setSubmissionsLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  useEffect(() => {
    if (!activeCategory) {
      setEditCategory({ label_sq: '', label_en: '', slug: '', sort_order: '' });
      return;
    }
    setEditCategory({
      label_sq: activeCategory.label_sq || '',
      label_en: activeCategory.label_en || '',
      slug: activeCategory.slug || '',
      sort_order: activeCategory.sort_order ?? 0,
    });
  }, [activeCategory]);

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

  const onCreateCategory = async (e) => {
    e.preventDefault();
    const labelSq = newCategory.label_sq.trim();
    const labelEn = newCategory.label_en.trim();
    const cleanedSlug = sanitizeSlug(newCategory.slug);

    if (!labelSq || !labelEn || !cleanedSlug) {
      setLoadError(t('admin.dashboard.categoryFormError'));
      return;
    }

    setSavingCategory(true);
    setLoadError('');
    const fallbackSort = categories.length + 1;
    const parsedSort = Number(newCategory.sort_order);
    const sortOrder = Number.isFinite(parsedSort) ? parsedSort : fallbackSort;

    const { data, error } = await supabase
      .from('categories')
      .insert({
        label_sq: labelSq,
        label_en: labelEn,
        slug: cleanedSlug,
        sort_order: sortOrder,
      })
      .select('id')
      .single();

    if (error) {
      setLoadError(error.message || t('admin.dashboard.saveError'));
      setSavingCategory(false);
      return;
    }

    setNewCategory({ label_sq: '', label_en: '', slug: '', sort_order: '' });
    await loadCategories();
    setCategoryId(data?.id || null);
    setSavingCategory(false);
  };

  const onUpdateCategory = async (e) => {
    e.preventDefault();
    if (!activeCategory?.id) return;
    const labelSq = editCategory.label_sq.trim();
    const labelEn = editCategory.label_en.trim();
    const cleanedSlug = sanitizeSlug(editCategory.slug);
    if (!labelSq || !labelEn || !cleanedSlug) {
      setLoadError(t('admin.dashboard.categoryFormError'));
      return;
    }
    setUpdatingCategory(true);
    setLoadError('');
    const parsedSort = Number(editCategory.sort_order);
    const sortOrder = Number.isFinite(parsedSort) ? parsedSort : activeCategory.sort_order || 0;
    const { error } = await supabase
      .from('categories')
      .update({
        label_sq: labelSq,
        label_en: labelEn,
        slug: cleanedSlug,
        sort_order: sortOrder,
      })
      .eq('id', activeCategory.id);
    if (error) {
      setLoadError(error.message || t('admin.dashboard.saveError'));
      setUpdatingCategory(false);
      return;
    }
    await loadCategories();
    setUpdatingCategory(false);
  };

  const onDeleteCategory = async () => {
    if (!activeCategory?.id) return;
    if (!window.confirm(t('admin.dashboard.confirmDeleteCategory', { name: labelForCategory(activeCategory) }))) return;
    setDeletingCategory(true);
    setLoadError('');
    const { error } = await supabase.from('categories').delete().eq('id', activeCategory.id);
    if (error) {
      setLoadError(error.message || t('admin.dashboard.saveError'));
      setDeletingCategory(false);
      return;
    }
    await loadCategories();
    setDeletingCategory(false);
  };

  const onApproveSubmission = async (submission) => {
    setSubmissionActionId(submission.id);
    setLoadError('');
    const { data: sortData } = await supabase
      .from('questions')
      .select('sort_order')
      .eq('category_id', submission.category_id)
      .order('sort_order', { ascending: false })
      .limit(1);
    const nextSort = (sortData?.[0]?.sort_order ?? -1) + 1;
    const { error: insertError } = await supabase.from('questions').insert({
      category_id: submission.category_id,
      question_sq: submission.question_text,
      question_en: submission.question_text,
      answer_sq: submission.answer_text,
      answer_en: submission.answer_text,
      sort_order: nextSort,
    });
    if (insertError) {
      setLoadError(insertError.message || t('admin.dashboard.saveError'));
      setSubmissionActionId(null);
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    await supabase
      .from('question_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: userData?.user?.id || null,
      })
      .eq('id', submission.id);
    await loadSubmissions();
    if (submission.category_id === categoryId) {
      await loadQuestions();
    }
    setSubmissionActionId(null);
  };

  const onDeclineSubmission = async (submission) => {
    setSubmissionActionId(submission.id);
    setLoadError('');
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('question_submissions')
      .update({
        status: 'declined',
        reviewed_at: new Date().toISOString(),
        reviewed_by: userData?.user?.id || null,
      })
      .eq('id', submission.id);
    if (error) {
      setLoadError(error.message || t('admin.dashboard.saveError'));
      setSubmissionActionId(null);
      return;
    }
    await loadSubmissions();
    setSubmissionActionId(null);
  };

  const formatReviewedAt = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString(i18n.language.startsWith('en') ? 'en-GB' : 'sq-AL', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  const submissionListForTab =
    submissionTab === 'pending' ? submissionPending : submissionTab === 'approved' ? submissionApproved : submissionDeclined;

  const submissionEmptyKey =
    submissionTab === 'pending'
      ? 'admin.dashboard.noSubmissions'
      : submissionTab === 'approved'
        ? 'admin.dashboard.noApprovedSubmissions'
        : 'admin.dashboard.noDeclinedSubmissions';

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
              <FaClipboardList className={viewingQuestions ? 'text-accent' : 'text-accent'} aria-hidden />
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
              <FaFolderOpen className={viewingCategories ? 'text-accent' : 'text-accent'} aria-hidden />
              {t('admin.dashboard.categoriesSection')}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('submissions')}
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                viewingSubmissions
                  ? 'border border-accent/30 bg-accent-soft/70 text-ink shadow-sm'
                  : 'text-ink-muted hover:bg-subtle hover:text-ink'
              }`}
            >
              <span className="flex items-center gap-3">
                <FaInbox className="text-accent" aria-hidden />
                {t('admin.dashboard.submissions')}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  viewingSubmissions ? 'bg-canvas text-ink' : 'bg-canvas text-ink-muted'
                }`}
              >
                {submissionPending.length}
              </span>
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
                    {viewingSubmissions
                      ? t('admin.dashboard.submissions')
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
                onClick={() => setActiveSection('submissions')}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  viewingSubmissions ? 'bg-ink text-white' : 'bg-canvas text-ink-muted ring-1 ring-line'
                }`}
              >
                {t('admin.dashboard.submissions')}
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
                    {viewingSubmissions
                      ? t('admin.dashboard.submissions')
                      : viewingCategories
                        ? t('admin.dashboard.categoriesSection')
                        : activeCategory
                          ? labelForCategory(activeCategory)
                          : '—'}
                  </p>
                </div>
                {viewingQuestions && (
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
                )}
              </div>

              {viewingSubmissions && (
                <section className="mb-8 rounded-3xl border border-line/80 bg-canvas/95 p-5 shadow-card backdrop-blur-sm sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {t('admin.dashboard.submissions')}
                  </p>
                  <div
                    className="mt-4 flex flex-wrap gap-2 border-b border-line/80 pb-3"
                    role="tablist"
                    aria-label={t('admin.dashboard.submissions')}
                  >
                    {[
                      { id: 'pending', label: t('admin.dashboard.submissionsPending'), count: submissionPending.length },
                      { id: 'approved', label: t('admin.dashboard.submissionsApproved'), count: submissionApproved.length },
                      { id: 'declined', label: t('admin.dashboard.submissionsDeclined'), count: submissionDeclined.length },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={submissionTab === tab.id}
                        onClick={() => setSubmissionTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          submissionTab === tab.id
                            ? 'bg-ink text-white shadow-sm'
                            : 'bg-subtle/80 text-ink-muted ring-1 ring-line hover:text-ink'
                        }`}
                      >
                        {tab.label}
                        <span className="ml-1.5 tabular-nums opacity-90">({tab.count})</span>
                      </button>
                    ))}
                  </div>
                  {submissionsLoading && <p className="mt-4 text-sm text-ink-muted">{t('learn.loading')}</p>}
                  {!submissionsLoading && submissionListForTab.length === 0 && (
                    <p className="mt-4 rounded-2xl border border-line bg-canvas px-4 py-6 text-sm text-ink-muted">
                      {t(submissionEmptyKey)}
                    </p>
                  )}
                  {!submissionsLoading && submissionListForTab.length > 0 && (
                    <ul className="mt-4 space-y-3">
                      {submissionListForTab.map((item) => {
                        const cat = categories.find((c) => c.id === item.category_id);
                        const busy = submissionActionId === item.id;
                        const isPending = submissionTab === 'pending';
                        return (
                          <li key={item.id} className="rounded-2xl border border-line bg-subtle/30 p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-ink">
                                {cat ? labelForCategory(cat) : '—'}
                              </span>
                              {!isPending && (
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                    submissionTab === 'approved'
                                      ? 'bg-emerald-100 text-emerald-900'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {submissionTab === 'approved'
                                    ? t('admin.dashboard.statusApproved')
                                    : t('admin.dashboard.statusDeclined')}
                                </span>
                              )}
                              <span className="text-xs text-ink-muted">{item.full_name}</span>
                              <span className="text-xs text-ink-muted">• {item.phone}</span>
                            </div>
                            <p className="mt-2 text-[11px] text-ink-muted">
                              {t('admin.dashboard.submittedAt', { date: formatReviewedAt(item.created_at) })}
                              {!isPending && item.reviewed_at ? (
                                <>
                                  {' · '}
                                  {t('admin.dashboard.reviewedAt', { date: formatReviewedAt(item.reviewed_at) })}
                                </>
                              ) : null}
                            </p>
                            <p className="mt-3 text-sm font-semibold text-ink">{item.question_text}</p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-ink-muted">{item.answer_text}</p>
                            {isPending && (
                              <div className="mt-4 flex flex-wrap justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => onDeclineSubmission(item)}
                                  disabled={busy}
                                  className="rounded-full border border-red-100 bg-canvas px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                                >
                                  {t('admin.dashboard.decline')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onApproveSubmission(item)}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
                                >
                                  <FaCheck aria-hidden />
                                  {t('admin.dashboard.approve')}
                                </button>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              )}

              {(viewingCategories || viewingQuestions) && (
                <>
              {viewingCategories && (
                <>
              <form
                onSubmit={onCreateCategory}
                className="mb-8 rounded-3xl border border-line/80 bg-canvas/95 p-5 shadow-card backdrop-blur-sm sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {t('admin.dashboard.addCategory')}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <label className="text-xs font-semibold text-ink-muted">
                    {t('admin.dashboard.categorySq')}
                    <input
                      type="text"
                      required
                      value={newCategory.label_sq}
                      onChange={(e) => setNewCategory((f) => ({ ...f, label_sq: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    />
                  </label>
                  <label className="text-xs font-semibold text-ink-muted">
                    {t('admin.dashboard.categoryEn')}
                    <input
                      type="text"
                      required
                      value={newCategory.label_en}
                      onChange={(e) =>
                        setNewCategory((f) => {
                          const nextEn = e.target.value;
                          if (f.slug.trim()) return { ...f, label_en: nextEn };
                          const autoSlug = nextEn
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-+|-+$/g, '');
                          return { ...f, label_en: nextEn, slug: autoSlug };
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    />
                  </label>
                  <label className="text-xs font-semibold text-ink-muted">
                    {t('admin.dashboard.categorySlug')}
                    <input
                      type="text"
                      required
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="intern-react"
                      className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    />
                  </label>
                  <label className="text-xs font-semibold text-ink-muted">
                    {t('admin.dashboard.sortOrder')}
                    <input
                      type="number"
                      value={newCategory.sort_order}
                      onChange={(e) => setNewCategory((f) => ({ ...f, sort_order: e.target.value }))}
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {t('admin.dashboard.editCategory')}
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <label className="text-xs font-semibold text-ink-muted">
                      {t('admin.dashboard.categorySq')}
                      <input
                        type="text"
                        required
                        value={editCategory.label_sq}
                        onChange={(e) => setEditCategory((f) => ({ ...f, label_sq: e.target.value }))}
                        className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                      />
                    </label>
                    <label className="text-xs font-semibold text-ink-muted">
                      {t('admin.dashboard.categoryEn')}
                      <input
                        type="text"
                        required
                        value={editCategory.label_en}
                        onChange={(e) => setEditCategory((f) => ({ ...f, label_en: e.target.value }))}
                        className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                      />
                    </label>
                    <label className="text-xs font-semibold text-ink-muted">
                      {t('admin.dashboard.categorySlug')}
                      <input
                        type="text"
                        required
                        value={editCategory.slug}
                        onChange={(e) => setEditCategory((f) => ({ ...f, slug: e.target.value }))}
                        className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                      />
                    </label>
                    <label className="text-xs font-semibold text-ink-muted">
                      {t('admin.dashboard.sortOrder')}
                      <input
                        type="number"
                        value={editCategory.sort_order}
                        onChange={(e) => setEditCategory((f) => ({ ...f, sort_order: e.target.value }))}
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
              )}

              {viewingQuestions && (
                <>
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
                </>
              )}
              </>
              )}
            </div>
          </main>
        </div>
      </div>

      <QuestionEditorModal
        open={modalOpen}
        initial={editing}
        categoryId={categoryId}
        categoryLabel={activeCategory ? labelForCategory(activeCategory) : ''}
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
