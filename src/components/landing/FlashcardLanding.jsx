import { useTranslation } from 'react-i18next';
import {
  FaBolt,
  FaBrain,
  FaCheckCircle,
  FaCode,
  FaComments,
  FaFire,
  FaLayerGroup,
  FaLightbulb,
  FaProjectDiagram,
  FaRedoAlt,
  FaServer,
  FaSync,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function BulletList({ items, className = '' }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <ul className={`space-y-3 ${className}`}>
      {list.map((item, i) => (
        <li key={i} className="flex gap-3 text-ink-muted">
          <FaCheckCircle className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LandingProblemSection() {
  const { t } = useTranslation();
  const bullets = t('landing.problem.bullets', { returnObjects: true });

  return (
    <section id="features" className="scroll-mt-24 border-b border-line bg-subtle/30 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('landing.problem.eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('landing.problem.title')}</h2>
          <p className="mt-6 text-lg font-medium text-ink">{t('landing.problem.intro')}</p>
          <div className="mt-6">
            <BulletList items={bullets} />
          </div>
          <p className="mt-10 text-xl font-semibold text-ink">{t('landing.problem.freeze')}</p>
          <p className="mt-4 text-lg text-ink-muted">{t('landing.problem.recallLine')}</p>
          <p className="mt-6 text-lg text-ink-muted">{t('landing.problem.need1')}</p>
          <p className="mt-2 text-xl font-semibold text-accent">{t('landing.problem.need2')}</p>
        </div>
      </div>
    </section>
  );
}

export function LandingSolutionSection() {
  const { t } = useTranslation();
  const steps = t('landing.solution.flashSteps', { returnObjects: true });

  return (
    <section id="levels" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-card">
              <FaBolt className="text-2xl" aria-hidden />
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-sun sm:text-4xl">{t('landing.solution.title')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('landing.solution.lead')}</p>
            <p className="mt-6 font-medium text-ink">{t('landing.solution.flashIntro')}</p>
            <BulletList items={steps} className="mt-4" />
            <p className="mt-8 text-lg font-medium text-ink">{t('landing.solution.closing')}</p>
          </div>
          <div className="rounded-3xl border border-line bg-gradient-to-br from-canvas to-accent-soft/25 p-8 shadow-card sm:p-10">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-ink-muted">
              <FaLayerGroup className="text-accent" aria-hidden />
              {t('landing.solution.cardPreview')}
            </div>
            <div className="mt-6 rounded-2xl border border-line bg-canvas p-6 shadow-inner">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">{t('landing.example.questionLabel')}</p>
              <p className="mt-2 font-display text-lg font-medium text-ink">{t('landing.example.questionShort')}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-accent/40 bg-subtle/50 p-4 text-center text-sm text-ink-muted">
              {t('landing.example.flipHint')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const stepIcons = [FaBrain, FaLayerGroup, FaLightbulb, FaSync, FaRedoAlt];

export function LandingHowSection() {
  const { t } = useTranslation();
  const keys = ['step1', 'step2', 'step3', 'step4', 'step5'];

  return (
    <section id="tracks" className="scroll-mt-24 border-y border-line bg-gradient-to-b from-subtle/40 to-canvas py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-16 xl:px-20 2xl:px-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('landing.how.eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-sun sm:text-4xl">{t('landing.how.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('landing.how.subtitle')}</p>
        </div>

        <ol className="mx-auto mt-16 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:gap-14 xl:grid-cols-5 xl:gap-12 2xl:gap-14">
          {keys.map((key, i) => {
            const Icon = stepIcons[i] || FaCheckCircle;
            return (
              <li
                key={key}
                className="relative flex min-w-0 w-full flex-col rounded-3xl border border-line bg-canvas p-9 text-center shadow-sm sm:p-10 lg:p-11"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-lg text-accent">
                  <Icon aria-hidden />
                </span>
                <span className="mt-5 font-display text-3xl font-bold text-line/80">{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">{t(`landing.how.${key}.title`)}</h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-ink-muted">{t(`landing.how.${key}.body`)}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function LandingScienceSection() {
  const { t } = useTranslation();
  const bullets = t('landing.science.bullets', { returnObjects: true });
  const usedBy = t('landing.science.usedBy', { returnObjects: true });
  const gains = t('landing.gain.bullets', { returnObjects: true });

  return (
    <section id="how" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('landing.science.title')}</h2>
            <BulletList items={bullets} className="mt-8" />
            <p className="mt-10 font-semibold text-ink">{t('landing.science.usedByLead')}</p>
            <BulletList items={usedBy} className="mt-4" />
          </div>
          <div className="rounded-3xl border border-line bg-subtle/40 p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <FaFire className="text-2xl text-sun" aria-hidden />
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{t('landing.gain.title')}</h2>
            </div>
            <BulletList items={gains} className="mt-8" />
            <p className="mt-8 border-t border-line pt-8 text-lg font-medium text-ink">{t('landing.gain.closing')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingExampleCardSection() {
  const { t } = useTranslation();

  return (
    <section id="example" className="scroll-mt-24 border-y border-line bg-canvas py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-sun sm:text-4xl">{t('landing.example.title')}</h2>
        <div className="mt-10 overflow-hidden rounded-3xl border border-line shadow-soft">
          <div className="h-1.5 bg-gradient-to-r from-accent via-sky-500 to-sun" aria-hidden />
          <div className="bg-canvas p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">{t('landing.example.questionLabel')}</p>
            <p className="mt-4 font-display text-xl font-medium leading-snug text-ink sm:text-2xl">{t('landing.example.question')}</p>
            <p className="mt-6 text-sm font-medium text-ink-muted">{t('landing.example.hint')}</p>
            <div className="mt-8 rounded-2xl border border-line bg-subtle/60 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/50">{t('landing.example.answerLabel')}</p>
              <p className="mt-3 leading-relaxed text-ink-muted">{t('landing.example.answer')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const builtIcons = [FaCode, FaServer, FaProjectDiagram, FaComments];

export function LandingBuiltForSection() {
  const { t } = useTranslation();
  const keys = ['frontend', 'backend', 'system', 'behavioral'];

  return (
    <section id="built" className="scroll-mt-24 bg-subtle/30 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('landing.built.title')}</h2>
          <p className="mt-4 text-lg text-ink-muted">{t('landing.built.subtitle')}</p>
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {keys.map((key, i) => {
            const Icon = builtIcons[i] || FaCode;
            return (
              <li
                key={key}
                className="flex gap-5 rounded-3xl border border-line bg-canvas p-6 shadow-sm transition hover:border-accent/25 hover:shadow-card"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-2xl text-accent">
                  <Icon aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{t(`landing.built.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(`landing.built.${key}.body`)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function LandingRepetitionSection() {
  const { t } = useTranslation();
  const lines = t('landing.repetition.lines', { returnObjects: true });

  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-gradient-to-br from-canvas via-canvas to-accent-soft/20 p-10 text-center shadow-card sm:p-14">
          <FaRedoAlt className="mx-auto text-3xl text-accent" aria-hidden />
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('landing.repetition.title')}</h2>
          <BulletList items={lines} className="mx-auto mt-8 max-w-md text-left" />
          <p className="mt-10 text-lg font-medium text-ink">{t('landing.repetition.footer')}</p>
        </div>
      </div>
    </section>
  );
}

export function LandingFinalCtaSection() {
  const { t } = useTranslation();

  return (
    <section id="cta-final" className="scroll-mt-24 border-t border-line bg-ink py-20 text-white sm:py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t('landing.finalCta.title')}</h2>
        <p className="mt-6 text-lg text-white/80">{t('landing.finalCta.subtitle')}</p>
        <p className="mt-4 text-base text-white/70">{t('landing.finalCta.lead')}</p>
        <Link
          to="/signup"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-white shadow-card transition hover:bg-accent-hover"
        >
          {t('landing.finalCta.button')}
        </Link>
      </div>
    </section>
  );
}
