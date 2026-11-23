import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock.jsx';
import { IconArrowRight, IconCopy, IconPlay } from '../components/Icons.jsx';
import { LESSONS } from '../data/lessons.js';
import '../styles/tutorial.css';

export default function Tutorial() {
  const [activa, setActiva] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const navigate = useNavigate();
  const leccion = LESSONS[activa];
  const num = String(activa + 1).padStart(2, '0');

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(leccion.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
    }
  };

  // "Probar este ejemplo" (J3).
  const probar = () => navigate('/editor', { state: { code: leccion.codigo } });

  return (
    <section className="tutorial">
      <div className="container">
        <header className="section-head section-head--center tutorial-head">
          <span className="eyebrow eyebrow--white">Aprende haciendo</span>
          <h1 className="section-title">
            De la primera línea
            <br />a tu primera parcela
          </h1>
          <p className="section-lead">
            {LESSONS.length} lecciones cortas para dominar los fundamentos de GreenCode a tu ritmo.
          </p>
        </header>

        <div className="lessons">
          <nav className="lesson-list" aria-label="Lecciones">
            {LESSONS.map((l, i) => (
              <button
                key={l.id}
                type="button"
                className={`lesson-item ${i === activa ? 'is-active' : ''}`}
                aria-current={i === activa ? 'step' : undefined}
                onClick={() => setActiva(i)}
              >
                <span className="lesson-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="lesson-info">
                  <strong>{l.titulo}</strong>
                  <small>{l.resumen}</small>
                </span>
                <IconArrowRight className="lesson-arrow" width={16} height={16} />
              </button>
            ))}
          </nav>

          <article className="lesson-body" key={leccion.id}>
            <div className="lesson-meta">
              <span>Lección {num}</span>
            </div>
            <h2 className="lesson-title">{leccion.titulo}</h2>
            <p className="lesson-desc">{leccion.resumen}</p>

            {leccion.codigo ? (
              <>
                <p className="lesson-tip">{leccion.tip}</p>
                <div className="lesson-code">
                  <div className="lesson-code-bar">
                    <span>{leccion.archivo}</span>
                    <button type="button" onClick={copiar}>
                      <IconCopy width={14} height={14} /> {copiado ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <CodeBlock code={leccion.codigo} className="lesson-code-body" />
                </div>
                <button type="button" className="btn btn-primary lesson-try" onClick={probar}>
                  <IconPlay width={16} height={16} /> Probar este ejemplo
                </button>
              </>
            ) : (
              <p className="lesson-pending">Contenido y ejemplo de esta lección: próximamente.</p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
