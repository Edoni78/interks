import { supabase } from './supabase';

const KINDS = new Set(['card_reveal', 'mc_correct', 'mc_incorrect']);

/**
 * Records one study interaction (non-blocking). Requires authenticated user.
 * @param {{ categoryId: string, questionId: string, eventKind: 'card_reveal' | 'mc_correct' | 'mc_incorrect' }} p
 */
export function logStudyProgressEvent(p) {
  if (!p?.categoryId || !p?.questionId || !KINDS.has(p.eventKind)) return;
  void (async () => {
    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth?.user?.id) return;
    await supabase.from('study_progress_events').insert({
      user_id: auth.user.id,
      category_id: p.categoryId,
      question_id: p.questionId,
      event_kind: p.eventKind,
    });
  })();
}
