import { useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LeafIcon } from '../components/Logo.jsx';
import { IconCode, IconDownload, IconPlay, IconTerminal, IconTrash, IconUpload } from '../components/Icons.jsx';
import ejemploInicial from '../demos/inicial.grc?raw';
import '../styles/editor.css';

/**
 * Página del Editor: ESTRUCTURA VISUAL (J1).
 * Los puntos marcados con "E2" / "E3":
 *  - E2: cambiar el <textarea> por CodeMirror, agregar el campo Entrada y llamar a POST /api/run.
 *  - E3: importar / exportar .grc, limpiar y mostrar errores con tipo y línea.
 */
const CONSOLA_INICIAL = [
  { tipo: 'muted', texto: 'GreenCode v1.0 listo.' },
  { tipo: 'info', texto: 'Presiona Ejecutar para iniciar.' },
];

export default function Editor() {
  const location = useLocation();
  // Si se llega desde el tutorial ("Probar este ejemplo"), usamos ese código.
  const [codigo, setCodigo] = useState(location.state?.code ?? ejemploInicial.replace(/\r\n/g, '\n'));
  const [consola, setConsola] = useState(CONSOLA_INICIAL);
  const [cursor, setCursor] = useState({ ln: 1, col: 1 });
  const gutterRef = useRef(null);

  const lineas = useMemo(() => codigo.split('\n').length, [codigo]);

  const avisar = (texto) => setConsola((c) => [...c, { tipo: 'muted', texto }]);

  // Puntos de conexión para E2 / E3 
  const ejecutar = () => avisar('› Ejecutar: conexión con el intérprete pendiente (E2).');
  const importar = () => avisar('› Importar .grc: disponible en la Parte 2 (E3).');
  const exportar = () => avisar('› Exportar .grc: disponible en la Parte 2 (E3).');
  const limpiar = () => avisar('› Limpiar: disponible en la Parte 2 (E3).');
  
  const restaurar = () => {
    setCodigo(ejemploInicial.replace(/\r\n/g, '\n'));
    setConsola(CONSOLA_INICIAL);
  };

  const actualizarCursor = (e) => {
    const antes = e.target.value.slice(0, e.target.selectionStart).split('\n');
    setCursor({ ln: antes.length, col: antes[antes.length - 1].length + 1 });
  };

  return (
    <section className="lab">
      <div className="container">
        <header className="section-head">
          <div>
            <span className="eyebrow">Laboratorio GreenCode</span>
            <h1 className="section-title">
              Escribe. Ejecuta.
              <br />
              Haz crecer tus ideas.
            </h1>
          </div>
          <p className="section-lead">
            Un espacio completo para experimentar con el lenguaje, importar tus archivos y detectar errores antes
            de llevar la lógica al invernadero.
          </p>
        </header>
      </div>

      <div className="container container--wide">
        <div className="workspace">
          {/* Barra superior */}
          <div className="ws-top">
            <div className="ws-tab">
              <LeafIcon size={16} />
              <span>programa.grc</span>
              <i className="ws-tab-dot" aria-hidden="true" />
            </div>
            <div className="ws-actions">
              <button type="button" className="ws-btn" onClick={importar}>
                <IconUpload width={15} height={15} /> <span>Importar</span>
              </button>
              <button type="button" className="ws-btn" onClick={exportar}>
                <IconDownload width={15} height={15} /> <span>Exportar</span>
              </button>
              <button type="button" className="ws-btn" onClick={limpiar}>
                <IconTrash width={15} height={15} /> <span>Limpiar</span>
              </button>
              <button type="button" className="btn btn-primary btn-sm ws-run" onClick={ejecutar}>
                <IconPlay width={15} height={15} /> Ejecutar
              </button>
            </div>
          </div>

          <div className="ws-panes">
            {/* Panel del editor */}
            <div className="ws-pane ws-editor">
              <div className="ws-pane-head">
                <span><IconCode width={13} height={13} /> Editor</span>
              </div>
              <div className="ws-code">
                <div className="ws-gutter" ref={gutterRef} aria-hidden="true">
                  {Array.from({ length: lineas }, (_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                {/* E2: reemplazar por <CodeMirror /> con resaltado de GreenCode */}
                <textarea
                  className="ws-textarea"
                  value={codigo}
                  spellCheck={false}
                  aria-label="Código GreenCode"
                  onChange={(e) => {
                    setCodigo(e.target.value);
                    actualizarCursor(e);
                  }}
                  onKeyUp={actualizarCursor}
                  onClick={actualizarCursor}
                  onScroll={(e) => {
                    if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop;
                  }}
                />
              </div>
            </div>

            {/* Panel de la consola */}
            <div className="ws-pane ws-console">
              <div className="ws-pane-head">
                <span><IconTerminal width={13} height={13} /> Consola</span>
                <span className="ws-head-right">
                  <b>Lista</b>
                  <button type="button" onClick={() => setConsola(CONSOLA_INICIAL)}>Limpiar consola</button>
                </span>
              </div>
              <div className="ws-output" role="log" aria-live="polite">
                {consola.map((l, i) => (
                  <p key={i} className={`out out--${l.tipo}`}>{l.texto}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="ws-status">
            <span><i className="status-dot" /> GreenCode 1.0</span>
            <span>UTF-8 · Ln {cursor.ln}, Col {cursor.col}</span>
          </div>
        </div>

        <p className="lab-hint">
          Prueba rápida:{' '}
          <button type="button" onClick={restaurar}>Restaurar ejemplo inicial</button> · Extensión de archivo{' '}
          <code>.grc</code>
        </p>
      </div>
    </section>
  );
}
