import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthSession } from './ProtectedRoute';
import { useUserProfile } from './hooks/useUserProfile';
import logo from '../assets/logo.png';

export function CompleteProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const session = useAuthSession();
  const userId = session?.user?.id;
  const { profile, loading, error, saveProfile } = useUserProfile(userId);
  const [displayName, setDisplayName] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && profile) {
      navigate('/dashboard', { replace: true });
    }
  }, [loading, profile, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const name = displayName.trim();
    if (!name) {
      setFormError(t('admin.profile.nameRequired'));
      return;
    }
    setSaving(true);
    try {
      await saveProfile(name);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(err.message === 'EMPTY_NAME' ? t('admin.profile.nameRequired') : err.message || t('admin.login.errorGeneric'));
    } finally {
      setSaving(false);
    }
  };

  if (!userId || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-subtle">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-canvas via-subtle to-accent-soft/35">
      <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 rounded-full bg-sun/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <div className="mb-10 max-w-lg lg:mb-0 lg:flex-1">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink">
            <img src={logo} alt="" className="h-9 w-9 object-contain" width={36} height={36} />
            interks
          </Link>
          <h1 className="mt-10 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {t('admin.profile.heroTitle')}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('admin.profile.heroSubtitle')}</p>
        </div>

        <div className="w-full max-w-md lg:flex-1">
          <div className="rounded-3xl border border-line bg-canvas/90 p-8 shadow-soft backdrop-blur-md sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-ink-muted">{t('admin.profile.panelTitle')}</p>

            {error && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
            )}

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="profile-display" className="block text-sm font-medium text-ink">
                  {t('admin.profile.displayName')}
                </label>
                <div className="relative mt-1.5">
                  <FaUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="profile-display"
                    type="text"
                    autoComplete="name"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-line bg-canvas py-3 pl-11 pr-4 text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder={t('admin.profile.displayNamePlaceholder')}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-muted">{t('admin.profile.displayNameHint')}</p>
              </div>

              {formError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover disabled:opacity-60"
              >
                {saving ? t('admin.dashboard.saving') : t('admin.profile.continue')}
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
