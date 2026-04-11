import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';

const steps = ['step1', 'step2', 'step3'];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how" className="scroll-mt-24 border-t border-line bg-subtle/40 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('how.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('how.subtitle')}</p>
        </div>

        <ol className="relative mx-auto mt-16 grid max-w-4xl gap-10 lg:grid-cols-3 lg:gap-8">
          <div
            className="pointer-events-none absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-accent/30 via-line to-transparent lg:left-1/2 lg:block lg:w-full lg:max-w-4xl lg:-translate-x-1/2 lg:bg-none"
            aria-hidden
          />
          {steps.map((step, i) => (
            <li key={step} className="relative flex flex-col lg:text-center">
              <div className="flex items-start gap-4 lg:flex-col lg:items-center">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-white shadow-card lg:mx-auto">
                  {i + 1}
                </span>
                <div className="lg:mt-6">
                  <div className="flex items-center gap-2 lg:justify-center">
                    <FaCheckCircle className="text-accent lg:hidden" aria-hidden />
                    <h3 className="text-lg font-semibold text-ink">{t(`how.${step}.title`)}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted lg:mx-auto lg:max-w-xs">
                    {t(`how.${step}.body`)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
