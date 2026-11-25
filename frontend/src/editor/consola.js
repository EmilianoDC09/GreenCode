/**
 * Convierte la respuesta de /api/run en líneas de consola: { tipo, texto }.
 * tipo = 'info' | 'ok' | 'error' | 'muted' | 'trace' (clases .out--* de editor.css).
 */
export const MAX_LINEAS = 500;

const ETIQUETAS = {
  lexico: 'Error léxico',
  sintactico: 'Error sintáctico',
  semantico: 'Error semántico',
  ejecucion: 'Error de ejecución',
  peticion: 'Petición inválida',
  servidor: 'Error del servidor',
  conexion: 'Sin conexión',
};

/** Las primeras MAX_LINEAS líneas y un aviso con cuántas se ocultaron. */
function recortar(textos, tipo) {
  const lineas = textos.slice(0, MAX_LINEAS).map((texto) => ({ tipo, texto }));
  if (textos.length > MAX_LINEAS) {
    lineas.push({ tipo: 'muted', texto: `… ${textos.length - MAX_LINEAS} líneas más ocultas` });
  }
  return lineas;
}

function ubicacion(e) {
  if (e.line == null) return '';
  return e.col == null ? ` (línea ${e.line})` : ` (línea ${e.line}, columna ${e.col})`;
}

export function lineasDeResultado(r, verTraza) {
  const lineas = [];

  if (verTraza && r.trace.length > 0) {
    lineas.push({ tipo: 'muted', texto: '── traza del intérprete ──' });
    lineas.push(...recortar(r.trace, 'trace'));
    lineas.push({ tipo: 'muted', texto: '── salida ──' });
  }

  lineas.push(...recortar(r.output, 'info'));
  if (r.ok && r.output.length === 0) {
    lineas.push({ tipo: 'muted', texto: '(el programa terminó sin emitir nada)' });
  }

  for (const e of r.errors) {
    lineas.push({ tipo: 'error', texto: `${ETIQUETAS[e.type] ?? 'Error'}${ubicacion(e)}: ${e.message}` });
  }

  const tiempo = r.timeMs > 0 ? ` · ${r.timeMs} ms` : '';
  if (r.ok) {
    lineas.push({ tipo: 'ok', texto: `✓ Ejecución correcta${tiempo}` });
  } else {
    const n = r.errors.length;
    lineas.push({ tipo: 'error', texto: `✗ Terminó con ${n} error${n === 1 ? '' : 'es'}${tiempo}` });
  }
  return lineas;
}
