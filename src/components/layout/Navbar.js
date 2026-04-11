import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaChevronDown, FaGlobe, FaTimes } from 'react-icons/fa';

const languages = [
  { code: 'sq', labelKey: 'nav.langSq' },
  { code: 'en', labelKey: 'nav.langEn' },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
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

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight text-ink"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('top');
          }}
        >
          interks
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          <button type="button" className={navLink} onClick={() => scrollTo('features')}>
            {t('nav.features')}
          </button>
          <button type="button" className={navLink} onClick={() => scrollTo('levels')}>
            {t('nav.levels')}
          </button>
          <button type="button" className={navLink} onClick={() => scrollTo('tracks')}>
            {t('nav.tracks')}
          </button>
          <button type="button" className={navLink} onClick={() => scrollTo('how')}>
            {t('nav.how')}
          </button>
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

          <button
            type="button"
            onClick={() => scrollTo('cta')}
            className="hidden rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover sm:inline-flex"
          >
            {t('nav.cta')}
          </button>

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
            <button
              type="button"
              onClick={() => scrollTo('cta')}
              className="mt-2 rounded-full bg-accent py-3 text-center text-sm font-semibold text-white"
            >
              {t('nav.cta')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
