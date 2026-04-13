import { useTranslation } from 'react-i18next';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-subtle/50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl font-semibold text-ink">interks</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">{t('footer.tagline')}</p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://twitter.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-ink-muted transition hover:border-accent/30 hover:text-accent hover:shadow-card"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://github.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-ink-muted transition hover:border-accent/30 hover:text-accent hover:shadow-card"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-ink-muted transition hover:border-accent/30 hover:text-accent hover:shadow-card"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('footer.product')}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li>
                <a href="#features" className="hover:text-ink">
                  {t('footer.linkFeatures')}
                </a>
              </li>
              <li>
                <a href="#levels" className="hover:text-ink">
                  {t('footer.linkLevels')}
                </a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-ink">
                  {t('footer.linkTracks')}
                </a>
              </li>
              <li>
                <Link to="/learn" className="hover:text-ink">
                  {t('footer.linkPractice')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('footer.company')}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li>
                <span className="cursor-not-allowed opacity-70">{t('footer.linkAbout')}</span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-70">{t('footer.linkCareers')}</span>
              </li>
            </ul>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('footer.legal')}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <span className="cursor-not-allowed opacity-70">{t('footer.linkPrivacy')}</span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-70">{t('footer.linkTerms')}</span>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-line pt-8 text-center text-xs text-ink-muted">
          {t('footer.copy', { year })}
          <span className="mx-2 text-line" aria-hidden>
            ·
          </span>
          <Link to="/admin/login" className="font-medium text-accent hover:text-accent-hover">
            {t('footer.adminLink')}
          </Link>
        </p>
      </div>
    </footer>
  );
}
