import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaChevronDown, FaGlobe, FaTimes, FaUserLock } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const languages = [
  { code: 'sq', labelKey: 'nav.langSq' },
  { code: 'en', labelKey: 'nav.langEn' },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const onLearn = pathname.startsWith('/learn');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const langCode = (i18n.language || 'sq').split('-')[0];
  const current = languages.find((l) => l.code === langCode) || languages[0];

  const navLink = 'text-ink-muted hover:text-ink transition-colors text-sm font-medium';
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const sectionLink = (id, label) =>
    onHome ? (
      <button key={id} type="button" className={navLink} onClick={() => scrollTo(id)}>
        {label}
      </button>
    ) : (
      <a key={id} href={`/#${id}`} className={navLink}>
        {label}
      </a>
    );

  const practiceClass = `${navLink} ${onLearn ? 'font-semibold text-accent' : ''}`;

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md font-display text-xl font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line focus-visible:ring-offset-2"
          onClick={(e) => {
            if (onHome) {
              e.preventDefault();
              scrollTo('top');
            }
          }}
        >
          <img src={logo} alt="" className="h-8 w-8 shrink-0 object-contain" width={32} height={32} />
          interks
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex" aria-label="Primary">
          {sectionLink('features', t('nav.features'))}
          {sectionLink('levels', t('nav.levels'))}
          {sectionLink('tracks', t('nav.tracks'))}
          {sectionLink('how', t('nav.how'))}
          <Link to="/learn" className={practiceClass} aria-current={onLearn ? 'page' : undefined}>
            {t('nav.practice')}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-subtle hover:shadow-card"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              <FaGlobe className="text-accent" aria-hidden />
              <span className="hidden sm:inline">{t(current.labelKey)}</span>
              <FaChevronDown
                className={`text-xs text-ink-muted transition ${langOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
            {langOpen && (
              <ul
                role="listbox"
                className="absolute right-0 mt-2 min-w-[11rem] overflow-hidden rounded-2xl border border-line bg-canvas py-1 shadow-soft"
              >
                {languages.map((lang) => (
                  <li key={lang.code} role="option" aria-selected={langCode === lang.code}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-subtle ${
                        langCode === lang.code ? 'font-semibold text-accent' : 'text-ink'
                      }`}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangOpen(false);
                      }}
                    >
                      {t(lang.labelKey)}
                      {langCode === lang.code && (
                        <span className="text-accent" aria-hidden>
                          ✓
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to="/admin/login"
            className="hidden items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-sun/60 hover:bg-subtle md:inline-flex"
          >
            <FaUserLock className="text-sun" aria-hidden />
            {t('nav.adminLogin')}
          </Link>

          {onHome ? (
            <button
              type="button"
              onClick={() => scrollTo('cta')}
              className="hidden rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover sm:inline-flex"
            >
              {t('nav.cta')}
            </button>
          ) : (
            <a
              href="/#cta"
              className="hidden rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover sm:inline-flex sm:items-center sm:justify-center"
            >
              {t('nav.cta')}
            </a>
          )}

          <button
            type="button"
            className="inline-flex rounded-full border border-line p-2.5 text-ink md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-canvas px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {onHome ? (
              <>
                <button type="button" className={`${navLink} text-left`} onClick={() => scrollTo('features')}>
                  {t('nav.features')}
                </button>
                <button type="button" className={`${navLink} text-left`} onClick={() => scrollTo('levels')}>
                  {t('nav.levels')}
                </button>
                <button type="button" className={`${navLink} text-left`} onClick={() => scrollTo('tracks')}>
                  {t('nav.tracks')}
                </button>
                <button type="button" className={`${navLink} text-left`} onClick={() => scrollTo('how')}>
                  {t('nav.how')}
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={`${navLink} text-left`} onClick={() => setMenuOpen(false)}>
                  {t('nav.home')}
                </Link>
                <a href="/#features" className={`${navLink} text-left`} onClick={() => setMenuOpen(false)}>
                  {t('nav.features')}
                </a>
                <a href="/#levels" className={`${navLink} text-left`} onClick={() => setMenuOpen(false)}>
                  {t('nav.levels')}
                </a>
                <a href="/#tracks" className={`${navLink} text-left`} onClick={() => setMenuOpen(false)}>
                  {t('nav.tracks')}
                </a>
                <a href="/#how" className={`${navLink} text-left`} onClick={() => setMenuOpen(false)}>
                  {t('nav.how')}
                </a>
              </>
            )}
            <Link
              to="/learn"
              className={`${navLink} text-left ${onLearn ? 'font-semibold text-accent' : ''}`}
              aria-current={onLearn ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.practice')}
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-line py-3 text-center text-sm font-semibold text-ink transition hover:bg-subtle"
            >
              <FaUserLock className="text-sun" aria-hidden />
              {t('nav.adminLogin')}
            </Link>
            {onHome ? (
              <button
                type="button"
                onClick={() => scrollTo('cta')}
                className="mt-2 rounded-full bg-accent py-3 text-center text-sm font-semibold text-white"
              >
                {t('nav.cta')}
              </button>
            ) : (
              <a
                href="/#cta"
                className="mt-2 rounded-full bg-accent py-3 text-center text-sm font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.cta')}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
