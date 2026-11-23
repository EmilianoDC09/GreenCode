import { Link } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock.jsx';
import { LeafIcon } from '../components/Logo.jsx';
import {
  IconArrowRight, IconBook, IconChart, IconCheck, IconCode, IconPlay, IconTerminal,
  IconThermo, IconDrop, IconFan, IconSun,
} from '../components/Icons.jsx';
import heroImg from '../assets/fondo_22.jpg';
// "?raw" hace que Vite importe el archivo .grc como texto plano.
import ejemploLanding from '../demos/landing.grc?raw';
import '../styles/inicio.css';

const CARACTERISTICAS = [
  {
    icon: IconChart,
    titulo: 'Lectura de sensores',
    texto: 'Guarda temperatura y humedad en variables de tipo clima y decide con ellas al instante.',
  },
  {
    icon: IconCode,
    titulo: 'Sintaxis natural',
    texto: 'Palabras en español tomadas del campo: brotar, nutrir, regar, cosecha. Se leen como se piensan.',
  },
  {
    icon: LeafIcon,
    titulo: 'Automatización agrícola',
    texto: 'Enciende actuadores, repite rutinas de riego y evalúa condiciones del invernadero sin complicaciones.',
  },
  {
    icon: IconTerminal,
    titulo: 'Respuesta inmediata',
    texto: 'Ejecuta desde el navegador contra el intérprete real y recibe resultados o errores en la consola.',
  },
];

// Glosario: cada palabra clave del lenguaje con su significado en el invernadero.
const GLOSARIO = [
  { kw: 'Parcela … Cosecha', que: 'Programa', desc: 'Todo programa es una parcela que se siembra y termina en cosecha.' },
  { kw: 'Brotar', que: 'Declarar', desc: 'Hace brotar una variable: brotar #temp tipo clima : 24.5;' },
  { kw: 'Nutrir', que: 'Asignar', desc: 'Le da un nuevo valor a una variable que ya brotó.' },
  { kw: 'Monitorear', que: 'Decidir', desc: 'Florece si se cumple, marchita para otra condición, reposo si ninguna.' },
  { kw: 'Regar · Madurar', que: 'Repetir', desc: 'Regar mientras haya condición; madurar de un valor a otro por pasos.' },
  { kw: 'Captar · Emitir', que: 'Entrada / salida', desc: 'Captar lee lecturas del usuario y Emitir muestra mensajes en consola.' },
  { kw: 'Injerto · Fruto', que: 'Funciones', desc: 'Un injerto recibe parámetros, produce un tipo y devuelve su fruto.' },
];

const TIPOS = [
  { icon: IconThermo, tipo: 'Clima', ej: '26.5', desc: 'Decimales: temperatura, humedad, pH' },
  { icon: IconDrop, tipo: 'Semilla', ej: '12', desc: 'Enteros: minutos de riego, conteos' },
  { icon: IconFan, tipo: 'Actuador', ej: 'Encendido', desc: 'Encendido o apagado: válvulas, ventiladores' },
  { icon: IconSun, tipo: 'Contexto', ej: '"Lote A"', desc: 'Texto: nombres y mensajes' },
];

export default function Landing() {
  return (
    <>
      {/* Descripcion */}
      <section id="inicio" className="hero">
        <img className="hero-bg" src={heroImg} alt="" />
        <div className="hero-shade" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow eyebrow--line eyebrow--light">Tecnología que cultiva futuro</span>
            <h1 className="hero-title">
              Programa el campo.
              <em>Cultiva con precisión.</em>
            </h1>
            <p className="hero-text">
              GreenCode es un lenguaje de programación simple y en español, diseñado para automatizar
              invernaderos, interpretar sensores y tomar mejores decisiones agrícolas.
            </p>
            <div className="hero-actions">
              <Link to="/editor" className="btn btn-primary">
                <IconPlay width={18} height={18} /> Probar GreenCode
              </Link>
              <Link to="/tutorial" className="btn btn-ghost">
                <IconBook width={18} height={18} /> Explorar tutorial
              </Link>
            </div>
            <ul className="hero-checks">
              <li><IconCheck width={16} height={16} /> Sintaxis en español</li>
              <li><IconCheck width={16} height={16} /> Sin instalación</li>
              <li><IconCheck width={16} height={16} /> Pensado para invernaderos</li>
            </ul>
          </div>

          {/* Ejemplo breve de código */}
          <figure className="code-window hero-code" aria-label="Ejemplo de código GreenCode">
            <div className="code-window-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="code-window-name">invernadero.grc</span>
            </div>
            <CodeBlock code={ejemploLanding} className="code-window-body" />
            <figcaption className="code-window-status">
              <span className="status-dot" /> Ventilación encendida · 29.5 °C
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Caracteristicas */}
      <section id="caracteristicas" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Pensado para la tierra</span>
              <h2 className="section-title">
                Un lenguaje tan claro
                <br />
                como tus objetivos
              </h2>
            </div>
            <p className="section-lead">
              Conecta la lógica de programación con las tareas reales del invernadero. Menos complejidad,
              más control sobre cada cultivo.
            </p>
          </div>

          <div className="features">
            {CARACTERISTICAS.map(({ icon: Icon, titulo, texto }, i) => (
              <article key={titulo} className="feature">
                <span className="feature-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="feature-icon"><Icon width={22} height={22} size={22} /></span>
                <h3 className="feature-title">{titulo}</h3>
                <p className="feature-text">{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Proposito */}
      <section id="tematica" className="section theme">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow eyebrow--light">Nuestro propósito</span>
              <h2 className="section-title">
                Del invernadero
                <br />
                al código
              </h2>
            </div>
            <p className="section-lead theme-lead">
              GreenCode nació para que estudiantes y productores aprendan a programar con el vocabulario que ya
              conocen: sembrar, nutrir, regar y cosechar. Cada instrucción representa una acción del invernadero.
            </p>
          </div>

          <div className="types">
            {TIPOS.map(({ icon: Icon, tipo, ej, desc }) => (
              <div key={tipo} className="type-card">
                <Icon width={22} height={22} />
                <div>
                  <p className="type-name">{tipo} <code>{ej}</code></p>
                  <p className="type-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <dl className="glossary">
            {GLOSARIO.map(({ kw, que, desc }) => (
              <div key={kw} className="glossary-item">
                <dt>
                  <code>{kw}</code>
                  <span>{que}</span>
                </dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tutorial o Editor */}
      <section className="section paths">
        <div className="container paths-grid">
          <Link to="/tutorial" className="path path--dark">
            <span className="eyebrow eyebrow--light">Aprende haciendo</span>
            <h3>De la primera línea a tu primera parcela</h3>
            <p>Siete lecciones cortas con ejemplos listos para ejecutar.</p>
            <span className="path-link">Ir al tutorial <IconArrowRight width={18} height={18} /></span>
          </Link>
          <Link to="/editor" className="path path--light">
            <span className="eyebrow">Laboratorio GreenCode</span>
            <h3>Escribe. Ejecuta. Haz crecer tus ideas.</h3>
            <p>Un editor en el navegador conectado al intérprete real de GreenCode.</p>
            <span className="path-link">Abrir el editor <IconArrowRight width={18} height={18} /></span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <section className="cta">
        <div className="container cta-inner">
          <LeafIcon size={40} className="cta-leaf" />
          <h2 className="cta-title">
            El futuro del campo
            <br />
            se escribe en verde.
          </h2>
          <p className="cta-text">Empieza ahora. Sin instalaciones, sin configuraciones y con todo lo necesario para aprender.</p>
          <Link to="/editor" className="btn btn-dark">
            <IconCode width={18} height={18} /> Abrir el editor
          </Link>
        </div>
      </section>
    </>
  );
}
