import { useTranslation } from 'react-i18next';
import { FaCodeBranch, FaLayerGroup, FaRoute, FaStream } from 'react-icons/fa';

const icons = {
  hub: FaLayerGroup,
  levels: FaStream,
  roles: FaRoute,
  patterns: FaCodeBranch,
};

const keys = ['hub', 'levels', 'roles', 'patterns'];

export function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-sun sm:text-4xl">{t('features.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('features.subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {keys.map((key) => {
            const Icon = icons[key];
            return (
              <article
                key={key}
                className="group rounded-3xl border border-line bg-canvas p-8 shadow-sm transition hover:border-accent/20 hover:shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition group-hover:bg-accent-soft">
                  <Icon className="text-xl" aria-hidden />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-ink">{t(`features.items.${key}.title`)}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{t(`features.items.${key}.body`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
