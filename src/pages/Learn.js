import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaLayerGroup,
} from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function Learn() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [qLoading, setQLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const en = i18n.language.startsWith('en');

  const labelForCategory = useCallback(
    (cat) => {
      if (!cat) return '';
      return en ? cat.label_en : cat.label_sq;
    },
    [en],
  );

  const textForQuestion = useCallback(
    (q) => (en ? q.question_en : q.question_sq) || '—',
    [en],
  );

  const textForAnswer = useCallback(
    (q) => (en ? q.answer_en : q.answer_sq) || '—',
    [en],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured()) {
        setLoadError('config');
        setCatLoading(false);
        return;
      }
      setLoadError('');
      setCatLoading(true);
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (cancelled) return;
      if (error) {
        setLoadError(error.message);
        setCategories([]);
        setCatLoading(false);
        return;
      }
      setCategories(data || []);
      setCatLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCategory = useMemo(() => {
    if (!categories.length) return null;
    if (!slug) return null;
    return categories.find((c) => c.slug === slug) || null;
  }, [categories, slug]);

  useEffect(() => {
    if (!categories.length || !slug) return;
    const ok = categories.some((c) => c.slug === slug);
    if (!ok) navigate('/learn', { replace: true });
  }, [categories, slug, navigate]);

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [activeCategory?.id]);

  useEffect(() => {
    if (!activeCategory?.id || !isSupabaseConfigured()) {
      setQuestions([]);
      return;
    }
    let cancelled = false;
    async function loadQ() {
      setQLoading(true);
      setLoadError('');
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category_id', activeCategory.id)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (cancelled) return;
      if (error) {
        setLoadError(error.message);
        setQuestions([]);
      } else {
        setQuestions(data || []);
      }
      setQLoading(false);
    }
    loadQ();
    return () => {
      cancelled = true;
    };
  }, [activeCategory?.id]);

  useEffect(() => {
    setRevealed(false);
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (questions.length === 0) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIndex((i) => Math.min(questions.length - 1, i + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [questions.length]);

  const current = questions[index];
  const total = questions.length;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  const selectLevel = (s) => {
    navigate(`/learn/${s}`);
  };

  const resetCategory = () => {
    navigate('/learn');
  };

  return (
    <div id="top" className="min-h-screen bg-subtle">
      <Navbar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-accent-soft blur-3xl" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-sun/20 blur-3xl" />
          <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <header className="mb-10 max-w-2xl lg:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('nav.practice')}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('learn.title')}</h1>
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{t('learn.subtitle')}</p>
            <Link
              to="/submit-question"
              className="mt-6 inline-flex items-center rounded-full border border-line bg-canvas px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-subtle"
            >
              {t('nav.submitQuestion')}
            </Link>
          </header>

          {loadError === 'config' && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-950">
              {t('admin.login.configError')}
            </div>
          )}

          {loadError && loadError !== 'config' && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-900">{loadError}</div>
          )}

          {catLoading && !loadError && (
            <p className="rounded-3xl border border-line bg-canvas/90 px-8 py-12 text-center text-ink-muted shadow-card backdrop-blur-sm">
              {t('learn.loading')}
            </p>
          )}

          {!catLoading && !loadError && categories.length === 0 && (
            <p className="rounded-3xl border border-line bg-canvas/90 px-8 py-12 text-center text-ink-muted shadow-card backdrop-blur-sm">
              {t('admin.dashboard.noCategories')}
            </p>
          )}

          {!catLoading && !loadError && categories.length > 0 && !activeCategory && (
            <section className="rounded-3xl border border-line/80 bg-canvas/95 p-6 shadow-card backdrop-blur-sm sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('learn.pickLevel')}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{t('learn.title')}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectLevel(cat.slug)}
                    className="group rounded-2xl border border-line bg-canvas p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                        <FaLayerGroup aria-hidden />
                      </span>
                      <span className="font-display text-lg font-semibold text-ink">{labelForCategory(cat)}</span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-ink-muted">{t('learn.openCategory')}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {!catLoading && !loadError && categories.length > 0 && activeCategory && (
            <div className="min-w-0">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={resetCategory}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2 text-sm font-semibold text-ink transition hover:bg-subtle"
                >
                  <FaArrowLeft aria-hidden />
                  {t('learn.changeCategory')}
                </button>
                <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  {labelForCategory(activeCategory)}
                </span>
              </div>

              {qLoading && (
                <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-line bg-canvas/90 shadow-card backdrop-blur-sm">
                  <p className="text-ink-muted">{t('learn.loading')}</p>
                </div>
              )}

              {!qLoading && total === 0 && (
                <div className="rounded-3xl border border-dashed border-accent/30 bg-gradient-to-br from-canvas via-canvas to-accent-soft/30 px-8 py-16 text-center shadow-card">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-xl text-accent">
                    <FaLayerGroup aria-hidden />
                  </div>
                  <p className="mx-auto max-w-sm text-ink-muted">{t('learn.empty')}</p>
                  <Link
                    to="/admin/login"
                    className="mt-8 inline-block text-sm font-semibold text-accent hover:text-accent-hover"
                  >
                    {t('nav.adminLogin')}
                  </Link>
                </div>
              )}

              {!qLoading && total > 0 && current && (
                <article className="overflow-hidden rounded-3xl border border-line/90 bg-canvas/95 shadow-soft backdrop-blur-sm">
                  <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent/80 to-sun" aria-hidden />
                  <div className="px-6 py-8 sm:px-10 sm:py-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium text-ink-muted">
                        {t('learn.progress', { current: index + 1, total })}
                      </p>
                      <p className="text-xs text-ink-muted">{t('learn.keyboardHint')}</p>
                    </div>

                    <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-subtle">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-sun transition-all duration-300"
                        style={{ width: `${((index + 1) / total) * 100}%` }}
                      />
                    </div>

                    <p className="mt-10 text-xs font-bold uppercase tracking-[0.15em] text-accent">{t('learn.question')}</p>
                    <p className="mt-3 whitespace-pre-wrap font-display text-xl font-medium leading-snug text-ink sm:text-2xl sm:leading-snug">
                      {textForQuestion(current)}
                    </p>

                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={() => setRevealed((r) => !r)}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-subtle/80 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/30 hover:bg-accent-soft/50"
                        aria-expanded={revealed}
                      >
                        {revealed ? (
                          <>
                            <FaEyeSlash className="text-accent" aria-hidden />
                            {t('learn.hideAnswer')}
                          </>
                        ) : (
                          <>
                            <FaEye className="text-accent" aria-hidden />
                            {t('learn.showAnswer')}
                          </>
                        )}
                      </button>

                      {revealed && (
                        <div className="mt-6 rounded-2xl border border-line/80 bg-gradient-to-br from-subtle to-accent-soft/20 p-6 shadow-sm">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">{t('learn.answer')}</p>
                          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-muted">{textForAnswer(current)}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        disabled={!canPrev}
                        onClick={() => setIndex((i) => i - 1)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-canvas px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/25 hover:bg-accent-soft/30 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FaChevronLeft aria-hidden />
                        {t('learn.previous')}
                      </button>
                      <button
                        type="button"
                        disabled={!canNext}
                        onClick={() => setIndex((i) => i + 1)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {t('learn.next')}
                        <FaChevronRight aria-hidden />
                      </button>
                    </div>
                  </div>
                </article>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
