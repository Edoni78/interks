/** @param {Date} d */
export function toLocalDayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Inclusive local-day range for last `dayCount` calendar days ending today. */
export function localDayRange(dayCount) {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  start.setDate(start.getDate() - (dayCount - 1));
  start.setHours(0, 0, 0, 0);
  const endIso = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
  return { start, end: endIso, keys: enumerateDayKeys(start, end) };
}

function enumerateDayKeys(start, end) {
  const keys = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (cur <= last) {
    keys.push(toLocalDayKey(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return keys;
}

/**
 * @param {Array<{ event_kind: string, created_at: string }>} rows
 * @param {string[]} dayKeys ordered
 */
export function aggregateByDay(rows, dayKeys) {
  const map = new Map();
  for (const k of dayKeys) {
    map.set(k, { card_reveal: 0, mc_correct: 0, mc_incorrect: 0, total: 0 });
  }
  for (const r of rows) {
    const key = toLocalDayKey(new Date(r.created_at));
    if (!map.has(key)) continue;
    const cell = map.get(key);
    const kind = r.event_kind;
    if (kind === 'card_reveal') cell.card_reveal += 1;
    else if (kind === 'mc_correct') cell.mc_correct += 1;
    else if (kind === 'mc_incorrect') cell.mc_incorrect += 1;
    cell.total += 1;
  }
  return dayKeys.map((k) => ({ dayKey: k, ...map.get(k) }));
}

export function totalsFromRows(rows) {
  let card = 0;
  let mcOk = 0;
  let mcBad = 0;
  for (const r of rows) {
    if (r.event_kind === 'card_reveal') card += 1;
    else if (r.event_kind === 'mc_correct') mcOk += 1;
    else if (r.event_kind === 'mc_incorrect') mcBad += 1;
  }
  const mcAttempts = mcOk + mcBad;
  const mcAccuracy = mcAttempts > 0 ? Math.round((mcOk / mcAttempts) * 100) : null;
  return { card, mcOk, mcBad, mcAttempts, mcAccuracy, total: card + mcAttempts };
}

/** Consecutive local days ending today with at least one event. */
export function streakDaysEndingToday(rows) {
  const daysWith = new Set();
  for (const r of rows) {
    daysWith.add(toLocalDayKey(new Date(r.created_at)));
  }
  let streak = 0;
  const cur = new Date();
  for (;;) {
    const k = toLocalDayKey(cur);
    if (!daysWith.has(k)) break;
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}
