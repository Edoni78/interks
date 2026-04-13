import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

export function CTASection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section id="cta" className="scroll-mt-24 pb-20 pt-4 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink px-6 py-14 text-white shadow-soft sm:px-10 sm:py-16 lg:px-14">
          <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" aria-hidden />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <FaEnvelope className="text-2xl" aria-hidden />
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-sun sm:text-4xl">{t('cta.title')}</h2>
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">{t('cta.subtitle')}</p>

            {done ? (
              <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur">
                <FaPaperPlane aria-hidden />
                {t('cta.thanks')}
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch">
                <label htmlFor="waitlist-email" className="sr-only">
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('cta.placeholder')}
                  className="min-h-[52px] flex-1 rounded-full border border-white/20 bg-white px-5 text-ink placeholder:text-ink-muted focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-8 font-semibold text-ink shadow-lg transition hover:bg-subtle"
                >
                  {t('cta.button')}
                  <FaPaperPlane className="text-sm" aria-hidden />
                </button>
              </form>
            )}

            <p className="mt-8 text-xs text-white/65">{t('cta.note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
