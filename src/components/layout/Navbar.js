import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { supabase } from '../../lib/supabase';

export function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s ?? null));
    return () => subscription.unsubscribe();
  }, []);

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

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
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
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {session === undefined ? (
            <span className="hidden h-10 w-24 animate-pulse rounded-full bg-subtle md:inline-block" aria-hidden />
          ) : session ? (
            <Link
              to="/dashboard"
              className="hidden items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/30 hover:bg-subtle md:inline-flex"
            >
              <FaUserCircle className="text-accent" aria-hidden />
              {t('nav.workspace')}
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="hidden rounded-full border border-line bg-canvas px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-subtle md:inline-flex"
              >
                {t('nav.createAccount')}
              </Link>
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover md:inline-flex"
              >
                {t('nav.signIn')}
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex rounded-full border border-line p-2.5 text-ink md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Mbyll menunë' : 'Hap menunë'}
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
            {session ? (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent py-3 text-center text-sm font-semibold text-white shadow-card transition hover:bg-accent-hover"
              >
                <FaUserCircle aria-hidden />
                {t('nav.workspace')}
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className={`${navLink} text-left font-semibold text-ink`}
                >
                  {t('nav.createAccount')}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-line py-3 text-center text-sm font-semibold text-ink transition hover:bg-subtle"
                >
                  {t('nav.signIn')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
