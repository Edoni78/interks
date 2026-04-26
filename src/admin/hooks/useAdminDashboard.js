import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const emptyNewCategory = { label_sq: '' };
const emptyEditCategory = { label_sq: '' };

function randomSlugSuffix() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  return Date.now().toString(36);
}

async function getAuthUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user?.id || null;
}

export function useAdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [savingNote, setSavingNote] = useState(false);
  const [activeSection, setActiveSection] = useState('questions');
  const [newCategory, setNewCategory] = useState(emptyNewCategory);
  const [editCategory, setEditCategory] = useState(emptyEditCategory);

  const labelForCategory = useCallback((cat) => {
    if (!cat) return '';
    return cat.label_sq || '';
  }, []);

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
  const viewingNotes = activeSection === 'notes';
  const viewingProgress = activeSection === 'progress';

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

  const loadNotes = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    setNotesLoading(true);
    setLoadError('');
    const { data, error } = await supabase
      .from('study_notes')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      setLoadError(error.message);
      setNotes([]);
    } else {
      setNotes(data || []);
    }
    setNotesLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (viewingNotes) {
      loadNotes();
    }
  }, [viewingNotes, loadNotes]);

  useEffect(() => {
    if (!activeCategory) {
      setEditCategory(emptyEditCategory);
      return;
    }
    setEditCategory({
      label_sq: activeCategory.label_sq || '',
    });
  }, [activeCategory]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  const onSaveQuestion = async (payload) => {
    setSaving(true);
    setLoadError('');
    try {
      const qSq = payload.question_sq;
      const aSq = payload.answer_sq;
      const questionKind = payload.question_kind === 'multiple_choice' ? 'multiple_choice' : 'open';
      const mcOptions = questionKind === 'multiple_choice' && Array.isArray(payload.mc_options) ? payload.mc_options : [];
      const mcCorrectIndex =
        questionKind === 'multiple_choice' && Number.isFinite(Number(payload.mc_correct_index))
          ? Number(payload.mc_correct_index)
          : null;
      const nextSortOrder = !payload.id
        ? questions.reduce((m, q) => Math.max(m, Number(q.sort_order) || 0), -1) + 1
        : Number.isFinite(Number(payload.sort_order))
          ? Number(payload.sort_order)
          : Number(questions.find((q) => q.id === payload.id)?.sort_order) || 0;
      const rowBase = {
        question_sq: qSq,
        question_en: qSq,
        answer_sq: aSq,
        answer_en: aSq,
        question_kind: questionKind,
        mc_options: mcOptions,
        mc_correct_index: mcCorrectIndex,
        sort_order: nextSortOrder,
      };
      if (payload.id) {
        const { error } = await supabase.from('questions').update(rowBase).eq('id', payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('questions').insert({
          category_id: payload.category_id,
          ...rowBase,
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
    if (!labelSq) {
      setLoadError(t('admin.dashboard.categoryFormError'));
      return;
    }

    const userId = await getAuthUserId();
    if (!userId) {
      setLoadError(t('admin.login.errorGeneric'));
      return;
    }

    let baseSlug = sanitizeSlug(labelSq);
    if (!baseSlug) baseSlug = `kat-${randomSlugSuffix()}`;

    const sortOrder = categories.reduce((m, c) => Math.max(m, Number(c.sort_order) || 0), -1) + 1;

    setSavingCategory(true);
    setLoadError('');

    let slugTry = baseSlug;
    let data = null;
    let lastError = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      const res = await supabase
        .from('categories')
        .insert({
          user_id: userId,
          label_sq: labelSq,
          label_en: labelSq,
          slug: slugTry,
          sort_order: sortOrder,
        })
        .select('id')
        .single();
      if (!res.error) {
        data = res.data;
        lastError = null;
        break;
      }
      lastError = res.error;
      const dup =
        res.error?.code === '23505' ||
        (typeof res.error?.message === 'string' &&
          (res.error.message.toLowerCase().includes('duplicate') || res.error.message.includes('unique')));
      if (dup) {
        slugTry = `${baseSlug}-${randomSlugSuffix()}`;
        continue;
      }
      break;
    }

    if (lastError && !data) {
      setLoadError(lastError.message || t('admin.dashboard.saveError'));
      setSavingCategory(false);
      return;
    }

    setNewCategory(emptyNewCategory);
    await loadCategories();
    setCategoryId(data?.id || null);
    setSavingCategory(false);
  };

  const onUpdateCategory = async (e) => {
    e.preventDefault();
    if (!activeCategory?.id) return;
    const labelSq = editCategory.label_sq.trim();
    if (!labelSq) {
      setLoadError(t('admin.dashboard.categoryFormError'));
      return;
    }
    setUpdatingCategory(true);
    setLoadError('');
    const { error } = await supabase
      .from('categories')
      .update({
        label_sq: labelSq,
        label_en: labelSq,
        slug: activeCategory.slug,
        sort_order: activeCategory.sort_order ?? 0,
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

  const onSaveNote = async ({ id, title, body }) => {
    setSavingNote(true);
    setLoadError('');
    try {
      const userId = await getAuthUserId();
      if (!userId) throw new Error('Not signed in');
      const titleTrim = (title || '').trim();
      const bodyTrim = (body || '').trim();
      if (!titleTrim) {
        setLoadError(t('admin.dashboard.noteTitleRequired'));
        setSavingNote(false);
        return;
      }
      if (id) {
        const existing = notes.find((n) => n.id === id);
        const keepOrder = Number(existing?.sort_order) || 0;
        const { error } = await supabase
          .from('study_notes')
          .update({ title: titleTrim, body: bodyTrim, sort_order: keepOrder })
          .eq('id', id);
        if (error) throw error;
      } else {
        const nextOrder = notes.reduce((m, n) => Math.max(m, Number(n.sort_order) || 0), -1) + 1;
        const { error } = await supabase.from('study_notes').insert({
          user_id: userId,
          title: titleTrim,
          body: bodyTrim,
          sort_order: nextOrder,
        });
        if (error) throw error;
      }
      setNoteModalOpen(false);
      setEditingNote(null);
      await loadNotes();
    } catch (err) {
      setLoadError(err.message || t('admin.dashboard.saveError'));
    } finally {
      setSavingNote(false);
    }
  };

  const onDeleteNote = async (id) => {
    if (!window.confirm(t('admin.dashboard.confirmDeleteNote'))) return;
    setLoadError('');
    const { error } = await supabase.from('study_notes').delete().eq('id', id);
    if (error) {
      setLoadError(error.message);
      return;
    }
    await loadNotes();
  };

  return {
    t,
    categories,
    categoryId,
    setCategoryId,
    questions,
    notes,
    notesLoading,
    loadError,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    saving,
    savingCategory,
    updatingCategory,
    deletingCategory,
    noteModalOpen,
    setNoteModalOpen,
    editingNote,
    setEditingNote,
    savingNote,
    activeSection,
    setActiveSection,
    newCategory,
    setNewCategory,
    editCategory,
    setEditCategory,
    labelForCategory,
    activeCategory,
    viewingQuestions,
    viewingCategories,
    viewingNotes,
    viewingProgress,
    signOut,
    onSaveQuestion,
    onDelete,
    onCreateCategory,
    onUpdateCategory,
    onDeleteCategory,
    onSaveNote,
    onDeleteNote,
  };
}
