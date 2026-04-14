import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const initialForm = {
  fullName: '',
  phone: '',
  categoryId: '',
  questionText: '',
  answerText: '',
};

export default function SubmitQuestion() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const en = i18n.language.startsWith('en');

  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      if (!isSupabaseConfigured()) {
        setError(t('admin.login.configError'));
        setLoading(false);
        return;
      }
      const { data, error: loadErr } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (cancelled) return;
      if (loadErr) {
        setError(loadErr.message);
        setLoading(false);
        return;
      }
      const rows = data || [];
      setCategories(rows);
      setForm((prev) => ({ ...prev, categoryId: rows[0]?.id || '' }));
      setLoading(false);
    }
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const categoryLabel = useMemo(
    () => (cat) => (en ? cat.label_en : cat.label_sq),
    [en],
  );

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      category_id: form.categoryId,
      question_text: form.questionText.trim(),
      answer_text: form.answerText.trim(),
    };
    if (!payload.full_name || !payload.phone || !payload.category_id || !payload.question_text || !payload.answer_text) {
      setError(t('submitQuestion.requiredError'));
      return;
    }
    setSaving(true);
    setError('');
    const { error: insertErr } = await supabase.from('question_submissions').insert(payload);
    if (insertErr) {
      setError(insertErr.message || t('submitQuestion.saveError'));
      setSaving(false);
      return;
    }
    setDone(true);
    setForm((prev) => ({ ...initialForm, categoryId: prev.categoryId }));
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-subtle">
      <Navbar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-accent-soft blur-3xl" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-sun/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-3xl border border-line/90 bg-canvas/95 p-6 shadow-card sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('submitQuestion.badge')}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{t('submitQuestion.title')}</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t('submitQuestion.subtitle')}</p>

            {loading && <p className="mt-6 text-sm text-ink-muted">{t('learn.loading')}</p>}
            {!loading && categories.length === 0 && <p className="mt-6 text-sm text-ink-muted">{t('admin.dashboard.noCategories')}</p>}

            {done && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {t('submitQuestion.success')}
              </div>
            )}
            {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>}

            {!loading && categories.length > 0 && (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <label className="block text-sm font-semibold text-ink">
                  {t('submitQuestion.fullName')}
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    required
                  />
                </label>
                <label className="block text-sm font-semibold text-ink">
                  {t('submitQuestion.phone')}
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    required
                  />
                </label>
                <label className="block text-sm font-semibold text-ink">
                  {t('submitQuestion.category')}
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {categoryLabel(cat)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-ink">
                  {t('submitQuestion.question')}
                  <textarea
                    rows={4}
                    value={form.questionText}
                    onChange={(e) => setForm((f) => ({ ...f, questionText: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm leading-relaxed text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    required
                  />
                </label>
                <label className="block text-sm font-semibold text-ink">
                  {t('submitQuestion.answer')}
                  <textarea
                    rows={6}
                    value={form.answerText}
                    onChange={(e) => setForm((f) => ({ ...f, answerText: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm leading-relaxed text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    required
                  />
                </label>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Link to="/learn" className="text-sm font-semibold text-ink-muted transition hover:text-ink">
                    {t('submitQuestion.backToLearn')}
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:opacity-60"
                  >
                    {saving ? t('admin.dashboard.saving') : t('submitQuestion.submit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
