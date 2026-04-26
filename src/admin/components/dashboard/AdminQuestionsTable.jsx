import { FaBook, FaPen, FaTrash } from 'react-icons/fa';
import { parseMcOptions } from '../../lib/questionMc';

function snippet(text, max = 96) {
  const s = (text || '').trim().replace(/\s+/g, ' ');
  if (!s) return '—';
  return s.length <= max ? s : `${s.slice(0, max)}…`;
}

function answerPreview(q, t) {
  if (q.question_kind === 'multiple_choice') {
    const opts = parseMcOptions(q.mc_options);
    const idx = Number(q.mc_correct_index);
    const line =
      Number.isFinite(idx) && idx >= 0 && idx < opts.length ? String(opts[idx] || '').trim() : (opts[0] || '').trim();
    return t('admin.dashboard.answerPreviewOptions', { text: snippet(line || q.answer_sq, 96) });
  }
  return snippet(q.answer_sq, 120);
}

export function AdminQuestionsTable({ questions, t, onStartStudy, onEdit, onDelete }) {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-line bg-canvas shadow-sm">
      <div className="border-b border-line/80 px-4 py-3 sm:px-5">
        <h2 className="font-display text-sm font-semibold text-ink sm:text-base">{t('admin.dashboard.questionsTableTitle')}</h2>
        <p className="mt-0.5 text-xs text-ink-muted">{t('admin.dashboard.questionsTableSubtitle')}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line/80 bg-subtle/40 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="w-12 px-3 py-3 sm:px-4">{t('admin.dashboard.questionsTableColNr')}</th>
              <th className="px-3 py-3 sm:px-4">{t('admin.dashboard.questionsTableColQuestion')}</th>
              <th className="hidden px-3 py-3 sm:table-cell sm:px-4">{t('admin.dashboard.questionsTableColAnswer')}</th>
              <th className="w-48 px-3 py-3 text-right sm:w-56 sm:px-4">{t('admin.dashboard.questionsTableColActions')}</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <tr key={q.id} className="border-b border-line/60 transition hover:bg-subtle/30">
                <td className="px-3 py-3 align-top text-ink-muted tabular-nums sm:px-4">{i + 1}</td>
                <td className="max-w-[220px] px-3 py-3 align-top text-ink sm:max-w-none sm:px-4">
                  <span className="line-clamp-3 whitespace-pre-wrap sm:line-clamp-2">{q.question_sq?.trim() || '—'}</span>
                </td>
                <td className="hidden max-w-xs px-3 py-3 align-top text-ink-muted sm:table-cell sm:px-4">
                  <span className="line-clamp-2">{answerPreview(q, t)}</span>
                </td>
                <td className="px-3 py-3 align-top sm:px-4">
                  <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => onStartStudy(i)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium text-ink transition hover:bg-subtle sm:px-3 sm:text-sm"
                    >
                      <FaBook className="text-ink-muted" aria-hidden />
                      {t('admin.dashboard.startLearning')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(q)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium text-ink transition hover:bg-subtle sm:px-3 sm:text-sm"
                    >
                      <FaPen className="text-ink-muted" aria-hidden />
                      {t('admin.dashboard.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(q.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium text-ink-muted transition hover:border-red-200 hover:bg-red-50/80 hover:text-red-700 sm:px-3 sm:text-sm"
                    >
                      <FaTrash aria-hidden />
                      {t('admin.dashboard.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
