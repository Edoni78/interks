import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!userId || !isSupabaseConfigured()) {
      setProfile(null);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (fetchError) {
      setProfile(null);
      setError(fetchError.message);
      setLoading(false);
      return;
    }
    setProfile(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const saveProfile = async (displayName) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const uid = userData?.user?.id;
    if (!uid) throw new Error('Not signed in');
    const trimmed = displayName.trim();
    if (!trimmed) throw new Error('EMPTY_NAME');
    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: uid,
      display_name: trimmed,
      updated_at: new Date().toISOString(),
    });
    if (upsertError) throw upsertError;
    await refetch();
  };

  return { profile, loading, error, refetch, saveProfile };
}
