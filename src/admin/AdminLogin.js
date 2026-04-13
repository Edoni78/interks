import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaLock, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import logo from '../assets/logo.png';

export function AdminLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin/dashboard', { replace: true });
    });
  }, [navigate]);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('en') ? 'sq' : 'en');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!isSupabaseConfigured()) {
      setError(t('admin.login.configError'));
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate('/admin/dashboard', { replace: true });
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/dashboard`,
          },
        });
        if (err) throw err;
        setInfo(t('admin.login.checkEmail'));
      }
    } catch (err) {
      setError(err.message || t('admin.login.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-canvas via-subtle to-accent-soft/35">
      <div
        className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 rounded-full bg-sun/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <div className="mb-10 max-w-lg lg:mb-0 lg:flex-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink"
          >
            <img src={logo} alt="" className="h-9 w-9 object-contain" width={36} height={36} />
            interks
          </Link>
          <h1 className="mt-10 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {t('admin.login.heroTitle')}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('admin.login.heroSubtitle')}</p>
        </div>

        <div className="w-full max-w-md lg:flex-1">
          <div className="rounded-3xl border border-line bg-canvas/90 p-8 shadow-soft backdrop-blur-md sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                {t('admin.login.panelTitle')}
              </p>
              <button
                type="button"
                onClick={toggleLang}
                className="flex items-center gap-2 rounded-full border border-line bg-subtle/80 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-subtle"
              >
                <FaGlobe className="text-accent" aria-hidden />
                {i18n.language.startsWith('en') ? 'SQ' : 'EN'}
              </button>
            </div>

            {!isSupabaseConfigured() && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {t('admin.login.configError')}
              </p>
            )}

            <div className="mt-6 flex rounded-full border border-line bg-subtle/50 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setInfo('');
                }}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                  mode === 'signin' ? 'bg-canvas text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t('admin.login.signIn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                  setInfo('');
                }}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                  mode === 'signup' ? 'bg-canvas text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t('admin.login.signUp')}
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-ink">
                  {t('admin.login.email')}
                </label>
                <div className="relative mt-1.5">
                  <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-ink">
                  {t('admin.login.password')}
                </label>
                <div className="relative mt-1.5">
                  <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
              )}
              {info && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  {info}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover disabled:opacity-60"
              >
                {loading ? t('admin.login.working') : mode === 'signin' ? t('admin.login.signIn') : t('admin.login.signUp')}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-ink-muted">
              <Link to="/" className="font-medium text-accent hover:text-accent-hover">
                {t('admin.login.backHome')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
