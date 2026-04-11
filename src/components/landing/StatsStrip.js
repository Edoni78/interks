import { useTranslation } from 'react-i18next';

export function StatsStrip() {
  const { t } = useTranslation();
  const items = ['one', 'two', 'three'];

  return (
    <section className="border-b border-line bg-subtle/60" aria-label="Highlights">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((key) => (
          <div key={key} className="flex flex-col items-center px-6 py-10 text-center">
            <span className="font-display text-4xl font-semibold text-accent">{t(`stats.${key}.value`)}</span>
            <span className="mt-2 max-w-[12rem] text-sm font-medium text-ink-muted">{t(`stats.${key}.label`)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
