import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { Prec } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { LeafIcon } from '../components/Logo.jsx';
import { IconCode, IconDownload, IconPlay, IconTerminal, IconTrash, IconUpload } from '../components/Icons.jsx';
import { greencode, greencodeTheme } from '../editor/greencode.js';
import { ejecutarPrograma } from '../editor/api.js';
import { lineasDeResultado } from '../editor/consola.js';
import ejemploInicial from '../demos/inicial.grc?raw';
import '../styles/editor.css';

/**
 * Página del Editor.
 *  - J1 (Jesús): estructura visual.
 *  - E2 (Emiliano): CodeMirror con resaltado de GreenCode, campo Entrada, Ejecutar contra POST /api/run, consola.
 *  - E3 (pendiente): importar / exportar .grc, limpiar editor y mensajes de error traducidos.
 */
const CONSOLA_INICIAL = [
  { tipo: 'muted', texto: 'GreenCode v1.0 listo.' },
  { tipo: 'info', texto: 'Presiona Ejecutar (o Ctrl+Enter) para correr el programa.' },
];

const ESTADOS = {
  lista: 'Lista',
  ejecutando: 'Ejecutando…',
  correcto: 'Correcto',
  errores: 'Con errores',
};

const normalizar = (texto) => texto.replace(/\r\n/g, '\n');

export default function Editor() {
  const location = useLocation();
  // Si se llega desde el tutorial ("Probar este ejemplo"), se usa ese código.
  const [codigo, setCodigo] = useState(() => normalizar(location.state?.code ?? ejemploInicial));
  const [entrada, setEntrada] = useState('');
  const [consola, setConsola] = useState(CONSOLA_INICIAL);
  const [resultado, setResultado] = useState(null);
  const [verTraza, setVerTraza] = useState(false);
  const verTrazaRef = useRef(false);
  const [estado, setEstado] = useState('lista');
  const [cursor, setCursor] = useState({ ln: 1, col: 1 });

  const avisar = (texto) => setConsola((c) => [...c, { tipo: 'muted', texto }]);

  const pintar = (r, traza) => [
    { tipo: 'muted', texto: '› programa.grc' },
    ...lineasDeResultado(r, traza),
  ];

  const ejecutar = useCallback(async () => {
    if (estado === 'ejecutando') return;
    setEstado('ejecutando');
    setConsola([{ tipo: 'muted', texto: '› Ejecutando programa.grc…' }]);
    const r = await ejecutarPrograma(codigo, entrada);
    setResultado(r);
    setConsola(pintar(r, verTrazaRef.current));
    setEstado(r.ok ? 'correcto' : 'errores');
  }, [codigo, entrada, estado]);

  // Ctrl+Enter / Cmd+Enter ejecuta. La extensión se crea una sola vez y lee la versión
  // más reciente de ejecutar() desde una referencia.
  const ejecutarRef = useRef(ejecutar);
  ejecutarRef.current = ejecutar;
  const extensiones = useMemo(
    () => [
      ...greencode,
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              ejecutarRef.current();
              return true;
            },
          },
        ])
      ),
    ],
    []
  );

  const alternarTraza = () => {
    const siguiente = !verTraza;
    verTrazaRef.current = siguiente;
    setVerTraza(siguiente);
    if (resultado && estado !== 'ejecutando') setConsola(pintar(resultado, siguiente));
  };

  const limpiarConsola = () => {
    setResultado(null);
    setConsola(CONSOLA_INICIAL);
    setEstado('lista');
  };

  // Puntos de conexión para E3
  const importar = () => avisar('› Importar .grc: disponible en la Parte 2 (E3).');
  const exportar = () => avisar('› Exportar .grc: disponible en la Parte 2 (E3).');
  const limpiar = () => avisar('› Limpiar: disponible en la Parte 2 (E3).');

  const restaurar = () => {
    setCodigo(normalizar(ejemploInicial));
    setEntrada('');
    limpiarConsola();
  };

  const actualizarCursor = (vu) => {
    if (!vu.docChanged && !vu.selectionSet) return;
    const pos = vu.state.selection.main.head;
    const linea = vu.state.doc.lineAt(pos);
    setCursor({ ln: linea.number, col: pos - linea.from + 1 });
  };

  const ejecutando = estado === 'ejecutando';

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
              <button
                type="button"
                className="btn btn-primary btn-sm ws-run"
                onClick={ejecutar}
                disabled={ejecutando}
                title="Ejecutar (Ctrl+Enter)"
              >
                <IconPlay width={15} height={15} /> {ejecutando ? 'Ejecutando…' : 'Ejecutar'}
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
                <CodeMirror
                  className="ws-cm"
                  value={codigo}
                  onChange={setCodigo}
                  onUpdate={actualizarCursor}
                  theme={greencodeTheme}
                  extensions={extensiones}
                  height="100%"
                  basicSetup={{
                    foldGutter: false,
                    autocompletion: false,
                    searchKeymap: true,
                    highlightActiveLine: true,
                    highlightActiveLineGutter: true,
                    tabSize: 2,
                  }}
                  aria-label="Código GreenCode"
                />
              </div>
            </div>

            {/* Panel de la consola */}
            <div className="ws-pane ws-console">
              <div className="ws-pane-head">
                <span><IconTerminal width={13} height={13} /> Consola</span>
                <span className="ws-head-right">
                  <b className={`ws-estado ws-estado--${estado}`}>{ESTADOS[estado]}</b>
                  <button type="button" onClick={alternarTraza} aria-pressed={verTraza}>
                    {verTraza ? 'Ocultar traza' : 'Ver traza'}
                  </button>
                  <button type="button" onClick={limpiarConsola}>Limpiar consola</button>
                </span>
              </div>

              <label className="ws-input">
                <span className="ws-input-label">
                  Entrada <small>valores para captar, uno por línea</small>
                </span>
                <textarea
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  rows={3}
                  spellCheck={false}
                  placeholder={'31.5\nencendido'}
                />
              </label>

              <div className="ws-output" role="log" aria-live="polite" aria-busy={ejecutando}>
                {consola.map((l, i) => (
                  <p key={i} className={`out out--${l.tipo}`}>{l.texto}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="ws-status">
            <span><i className="status-dot" /> GreenCode 1.0 · Ctrl+Enter para ejecutar</span>
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
