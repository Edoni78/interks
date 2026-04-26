import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { aggregateByDay, localDayRange, streakDaysEndingToday, totalsFromRows } from '../../lib/studyProgressAnalytics';

function formatDayLabel(dayKey, locale = 'sq-AL') {
  const [y, m, d] = dayKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function AdminProgressSection({ t, categories, labelForCategory }) {
  const [rangeDays, setRangeDays] = useState(14);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setFetchError(t('admin.login.configError'));
      setLoading(false);
      setRows([]);
      return;
    }
    setLoading(true);
    setFetchError('');
    const { start, end } = localDayRange(rangeDays);
    let q = supabase
      .from('study_progress_events')
      .select('event_kind, created_at, category_id')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: true });
    if (categoryFilter !== 'all') {
      q = q.eq('category_id', categoryFilter);
    }
    const { data, error } = await q;
    if (error) {
      setFetchError(error.message || t('admin.dashboard.progressLoadError'));
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }, [rangeDays, categoryFilter, t]);

  useEffect(() => {
    load();
  }, [load]);

  const { keys } = useMemo(() => localDayRange(rangeDays), [rangeDays]);
  const series = useMemo(() => aggregateByDay(rows, keys), [rows, keys]);
  const totals = useMemo(() => totalsFromRows(rows), [rows]);
  const streak = useMemo(() => streakDaysEndingToday(rows), [rows]);

  const maxDayTotal = useMemo(() => {
    let m = 1;
    for (const d of series) {
      const s = d.card_reveal + d.mc_correct + d.mc_incorrect;
      if (s > m) m = s;
    }
    return m;
  }, [series]);

  const tableRows = useMemo(() => [...series].reverse(), [series]);

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{t('admin.dashboard.progressEyebrow')}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{t('admin.dashboard.progressTitle')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{t('admin.dashboard.progressSubtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-line bg-canvas px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-subtle disabled:opacity-50"
        >
          <FaChartLine className="text-accent" aria-hidden />
          {t('admin.dashboard.progressRefresh')}
        </button>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[7, 14, 30].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRangeDays(n)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                rangeDays === n ? 'bg-ink text-white shadow-sm' : 'border border-line bg-canvas text-ink-muted hover:bg-subtle hover:text-ink'
              }`}
            >
              {t(`admin.dashboard.progressRange${n}`)}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5 sm:max-w-xs">
          <label htmlFor="progress-category" className="text-xs font-semibold text-ink-muted">
            {t('admin.dashboard.progressFilterTopic')}
          </label>
          <select
            id="progress-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-line bg-canvas px-4 py-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="all">{t('admin.dashboard.progressFilterAll')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {labelForCategory(c)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fetchError ? (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">{fetchError}</div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-line bg-canvas">
          <p className="text-sm text-ink-muted">{t('admin.dashboard.progressLoading')}</p>
        </div>
      ) : (
        <>
          <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('admin.dashboard.progressSummaryTotal')}</p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-ink">{totals.total}</p>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('admin.dashboard.progressSummaryCardFlips')}</p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-accent">{totals.card}</p>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('admin.dashboard.progressSummaryOptionsAttempts')}</p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-ink">{totals.mcAttempts}</p>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('admin.dashboard.progressSummaryOptionsAccuracy')}</p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-emerald-600">
                {totals.mcAccuracy !== null ? `${totals.mcAccuracy}%` : '—'}
              </p>
            </div>
          </div>

          {streak > 0 ? (
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft/50 px-4 py-2 text-sm font-semibold text-ink">
              <span className="text-accent" aria-hidden>
                ●
              </span>
              {t('admin.dashboard.progressStreak', { count: streak })}
            </div>
          ) : null}

          {!loading && totals.total === 0 && !fetchError ? (
            <div className="mb-8 rounded-2xl border border-dashed border-line bg-subtle/30 px-6 py-12 text-center">
              <p className="text-sm font-medium text-ink">{t('admin.dashboard.progressEmptyTitle')}</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{t('admin.dashboard.progressEmptyBody')}</p>
            </div>
          ) : null}

          {totals.total > 0 ? (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-accent" aria-hidden />
                  {t('admin.dashboard.progressLegendCard')}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden />
                  {t('admin.dashboard.progressLegendOptionsOk')}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" aria-hidden />
                  {t('admin.dashboard.progressLegendOptionsBad')}
                </span>
              </div>
              <div className="mb-10 overflow-x-auto rounded-2xl border border-line bg-canvas p-4 shadow-sm sm:p-6">
                <p className="mb-4 text-sm font-semibold text-ink">{t('admin.dashboard.progressChartTitle')}</p>
                <div className="flex min-h-[11rem] items-end gap-1 sm:gap-1.5" role="img" aria-label={t('admin.dashboard.progressChartTitle')}>
                  {series.map((d) => {
                    const { card_reveal: rev, mc_correct: ok, mc_incorrect: bad, dayKey } = d;
                    const sum = rev + ok + bad;
                    const colPx = 176;
                    const seg = (n) => (n <= 0 ? 0 : Math.max(Math.round((n / maxDayTotal) * colPx), 4));
                    return (
                      <div key={dayKey} className="flex min-w-[2rem] flex-1 flex-col items-center gap-2 sm:min-w-[2.25rem]">
                        <div
                          className="flex h-44 w-full max-w-[3rem] flex-col justify-end gap-px self-center rounded-md bg-subtle/50 p-px"
                          title={`${formatDayLabel(dayKey)} — ${sum}`}
                        >
                          {sum === 0 ? (
                            <div className="h-1 w-full rounded-sm bg-subtle/80" />
                          ) : (
                            <>
                              {rev > 0 ? (
                                <div style={{ height: seg(rev) }} className="w-full rounded-sm bg-accent" title={`${rev}`} />
                              ) : null}
                              {ok > 0 ? (
                                <div style={{ height: seg(ok) }} className="w-full rounded-sm bg-emerald-500" title={`${ok}`} />
                              ) : null}
                              {bad > 0 ? (
                                <div style={{ height: seg(bad) }} className="w-full rounded-sm bg-rose-400" title={`${bad}`} />
                              ) : null}
                            </>
                          )}
                        </div>
                        <span className="max-w-[4.5rem] truncate text-center text-[10px] font-medium leading-tight text-ink-muted sm:text-[11px]">
                          {formatDayLabel(dayKey)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-line bg-canvas shadow-sm">
                <div className="border-b border-line/80 px-4 py-3 sm:px-5">
                  <h2 className="font-display text-sm font-semibold text-ink sm:text-base">{t('admin.dashboard.progressTableTitle')}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line/80 bg-subtle/40 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                        <th className="px-4 py-3 sm:px-5">{t('admin.dashboard.progressTableDate')}</th>
                        <th className="px-4 py-3 sm:px-5">{t('admin.dashboard.progressTableCardReveals')}</th>
                        <th className="px-4 py-3 sm:px-5">{t('admin.dashboard.progressTableOptionsCorrect')}</th>
                        <th className="px-4 py-3 sm:px-5">{t('admin.dashboard.progressTableOptionsWrong')}</th>
                        <th className="px-4 py-3 sm:px-5">{t('admin.dashboard.progressTableTotal')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((d) => (
                        <tr key={d.dayKey} className="border-b border-line/60 last:border-0">
                          <td className="px-4 py-3 font-medium text-ink sm:px-5">{formatDayLabel(d.dayKey)}</td>
                          <td className="px-4 py-3 tabular-nums text-ink-muted sm:px-5">{d.card_reveal}</td>
                          <td className="px-4 py-3 tabular-nums text-emerald-700 sm:px-5">{d.mc_correct}</td>
                          <td className="px-4 py-3 tabular-nums text-rose-700 sm:px-5">{d.mc_incorrect}</td>
                          <td className="px-4 py-3 font-semibold tabular-nums text-ink sm:px-5">
                            {d.card_reveal + d.mc_correct + d.mc_incorrect}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
