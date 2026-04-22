import { FaLayerGroup, FaPlus } from 'react-icons/fa';

export function AdminQuestionsEmpty({ t, onAdd }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-canvas px-8 py-16 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-subtle/50 text-xl text-ink-muted">
        <FaLayerGroup aria-hidden />
      </div>
      <p className="mx-auto max-w-sm text-base leading-relaxed text-ink-muted">{t('admin.dashboard.empty')}</p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line bg-canvas px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-subtle"
      >
        <FaPlus aria-hidden />
        {t('admin.dashboard.addQuestion')}
      </button>
    </div>
  );
}
