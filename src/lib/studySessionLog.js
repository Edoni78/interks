import { supabase } from './supabase';

/**
 * @param {string} categoryId
 * @param {number} cardsTotal
 * @param {boolean} wasShuffled
 * @returns {Promise<string | null>} session id
 */
export async function insertStudySession(categoryId, cardsTotal, wasShuffled) {
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr || !auth?.user?.id || !categoryId) return null;
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: auth.user.id,
      category_id: categoryId,
      cards_total: Math.max(0, cardsTotal | 0),
      was_shuffled: Boolean(wasShuffled),
    })
    .select('id')
    .single();
  if (error) return null;
  return data?.id || null;
}

/** Marks session finished (completed deck or closed early). */
export async function finishStudySession(sessionId) {
  if (!sessionId) return;
  await supabase
    .from('study_sessions')
    .update({ finished_at: new Date().toISOString() })
    .eq('id', sessionId);
}
