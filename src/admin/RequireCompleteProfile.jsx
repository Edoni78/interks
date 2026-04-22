import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthSession } from './ProtectedRoute';
import { useUserProfile } from './hooks/useUserProfile';

export function RequireCompleteProfile({ children }) {
  const session = useAuthSession();
  const userId = session?.user?.id;
  const { t } = useTranslation();
  const { profile, loading, error } = useUserProfile(userId);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-subtle px-4">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-subtle px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-900">
          <p className="font-semibold">{t('admin.profile.loadErrorTitle')}</p>
          <p className="mt-2 text-red-800">{error}</p>
          <p className="mt-3 text-xs text-red-800/90">{t('admin.profile.schemaHint')}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
