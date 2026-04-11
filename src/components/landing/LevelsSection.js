import { useTranslation } from 'react-i18next';
import { FaLeaf, FaRocket, FaStar, FaUserGraduate } from 'react-icons/fa';

const config = [
  { key: 'intern', icon: FaLeaf },
  { key: 'junior', icon: FaUserGraduate },
  { key: 'mid', icon: FaRocket },
  { key: 'senior', icon: FaStar },
];

export function LevelsSection() {
  const { t } = useTranslation();

  return (
    <section id="levels" className="scroll-mt-24 border-y border-line bg-gradient-to-b from-subtle/50 to-canvas py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('levels.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('levels.subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {config.map(({ key, icon: Icon }, i) => (
            <article
              key={key}
              className="relative flex flex-col rounded-3xl border border-line bg-canvas p-7 shadow-sm"
            >
              <span
                className="absolute right-6 top-6 font-display text-5xl font-bold text-line"
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-card">
                <Icon aria-hidden />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-ink">{t(`levels.${key}.title`)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{t(`levels.${key}.body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
