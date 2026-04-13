import { useTranslation } from 'react-i18next';
import { FaArrowRight, FaLayerGroup, FaUserLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Hero() {
  const { t } = useTranslation();

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      className="relative overflow-hidden border-b border-line bg-gradient-to-b from-canvas via-canvas to-subtle"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-accent/[0.03] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-sun/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-1.5 text-xs font-medium text-ink-muted shadow-sm">
          <FaLayerGroup className="text-accent" aria-hidden />
          {t('hero.badge')}
        </div>

        <h1
          id="hero-heading"
          className="mt-8 max-w-4xl font-display text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
        >
          {t('hero.title')}{' '}
          <span className="bg-gradient-to-r from-accent via-sky-500 to-sun bg-clip-text text-transparent">
            {t('hero.titleAccent')}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">{t('hero.subtitle')}</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => go('cta')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-soft transition hover:bg-accent-hover"
          >
            {t('hero.primaryCta')}
            <FaArrowRight className="text-sm" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go('how')}
            className="inline-flex items-center justify-center rounded-full border border-line bg-canvas px-7 py-3.5 text-base font-semibold text-ink shadow-sm transition hover:bg-subtle"
          >
            {t('hero.secondaryCta')}
          </button>
          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line border-sun/40 bg-canvas px-7 py-3.5 text-base font-semibold text-ink shadow-sm transition hover:border-sun hover:bg-sun/10"
          >
            <FaUserLock className="text-sun" aria-hidden />
            {t('nav.adminLogin')}
          </Link>
        </div>

        <p className="mt-8 text-sm text-ink-muted">{t('hero.footnote')}</p>
      </div>
    </section>
  );
}
