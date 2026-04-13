import { useTranslation } from 'react-i18next';
import { FaCode, FaDesktop, FaProjectDiagram, FaServer } from 'react-icons/fa';

const config = [
  { key: 'frontend', icon: FaDesktop },
  { key: 'backend', icon: FaServer },
  { key: 'fullstack', icon: FaProjectDiagram },
  { key: 'software', icon: FaCode },
];

export function TracksSection() {
  const { t } = useTranslation();

  return (
    <section id="tracks" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-sun sm:text-4xl">{t('tracks.title')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('tracks.subtitle')}</p>
          </div>
        </div>

        <ul className="mt-14 grid list-none gap-5 sm:grid-cols-2">
          {config.map(({ key, icon: Icon }) => (
            <li
              key={key}
              className="flex gap-5 rounded-3xl border border-line bg-canvas p-6 shadow-sm transition hover:shadow-card"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-2xl text-accent">
                <Icon aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">{t(`tracks.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(`tracks.${key}.body`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
