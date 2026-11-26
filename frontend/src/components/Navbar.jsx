import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import { IconArrowRight, IconClose, IconMenu } from './Icons.jsx';

/** Barra de navegación. */
const LINKS = [
  { to: '/', label: 'Inicio', isActive: (p, h) => p === '/' && h !== '#caracteristicas' },
  { to: '/#caracteristicas', label: 'Características', isActive: (p, h) => p === '/' && h === '#caracteristicas' },
  { to: '/tutorial', label: 'Tutorial', isActive: (p) => p === '/tutorial' },
];

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Cierra el menú móvil cada vez que cambia la ruta.
  useEffect(() => setOpen(false), [pathname, hash]);

  // Agrega una sombra a la barra cuando el usuario ya bajó un poco.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${open ? 'navbar--open' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" aria-label="GreenCode, ir al inicio">
          <Logo />
        </Link>

        <nav id="menu-principal" className="navbar-links" aria-label="Principal">
          {LINKS.map(({ to, label, isActive }) => (
            <Link
              key={to}
              to={to}
              className={`navbar-link ${isActive(pathname, hash) ? 'is-active' : ''}`}
              aria-current={isActive(pathname, hash) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <Link to="/editor" className={`btn btn-dark navbar-cta ${pathname === '/editor' ? 'is-active' : ''}`}>
            Abrir editor <IconArrowRight width={16} height={16} />
          </Link>
        </nav>

        <button
          type="button"
          className="navbar-toggle"
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>
    </header>
  );
}
