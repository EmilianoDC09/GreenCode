import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <Link to="/" aria-label="GreenCode, ir al inicio">
            <Logo tone="light" />
          </Link>
          <p className="footer-tagline">Lenguaje de programación para invernaderos más inteligentes.</p>
          <nav className="footer-links" aria-label="Pie de página">
            <Link to="/tutorial">Documentación</Link>
            <Link to="/editor">Editor</Link>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              Volver arriba
            </a>
          </nav>
        </div>
        <p className="footer-bottom">
          © 2026 GreenCode · Lenguajes y Autómatas II · Instituto Tecnológico de Morelia
        </p>
      </div>
    </footer>
  );
}
