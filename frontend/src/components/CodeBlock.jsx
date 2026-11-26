import { Fragment } from 'react';

/**
 * Resaltado de sintaxis de GreenCode para bloques de SOLO LECTURA
 * (landing y tutorial)
 * Funciona como un mini-lexer: recorre el texto con una expresión regular
 * que reconoce los mismos tokens que greenCode.g4 y les asigna una clase CSS.
 */
const KEYWORDS = new Set([
  'parcela', 'cosecha', 'injerto', 'produce', 'fruto',
  'brotar', 'tipo', 'nutrir',
  'monitorear', 'florece', 'marchita', 'reposo',
  'regar', 'madurar', 'desde', 'hasta', 'paso',
  'emitir', 'captar',
]);
const TYPES = new Set(['clima', 'semilla', 'actuador', 'contexto']);
const WORD_OPS = new Set(['supera', 'debajo', 'coincide', 'difiere', 'fusion', 'relevo', 'no']);
const LITERALS = new Set(['encendido', 'apagado']);

// Orden importante: comentarios y cadenas primero para que su contenido no se tokenice.
const TOKEN_RE =
  /(&>[\s\S]*?<&)|(>>[^\n]*)|("[^"\n]*")|(#[A-Za-z][A-Za-z0-9_]*)|(\d+\.\d+|\d+)|([a-zA-Z_][A-Za-z0-9_]*)/g;

export function tokenize(code) {
  const parts = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN_RE)) {
    if (m.index > last) parts.push({ text: code.slice(last, m.index) });
    const [text, blockCom, lineCom, str, variable, num, word] = m;
    let cls;
    if (blockCom || lineCom) cls = 'com';
    else if (str) cls = 'str';
    else if (variable) cls = 'var';
    else if (num) cls = 'num';
    else if (word) {
      if (KEYWORDS.has(word)) cls = 'kw';
      else if (TYPES.has(word)) cls = 'type';
      else if (WORD_OPS.has(word)) cls = 'op';
      else if (LITERALS.has(word)) cls = 'lit';
      else cls = 'fn';
    }
    parts.push({ text, cls });
    last = m.index + text.length;
  }
  if (last < code.length) parts.push({ text: code.slice(last) });
  return parts;
}

export default function CodeBlock({ code, className = '' }) {
  return (
    <pre className={`code ${className}`}>
      <code>
        {tokenize(code.replace(/\r\n/g, '\n').trimEnd()).map((p, i) =>
          p.cls ? (
            <span key={i} className={`tok-${p.cls}`}>{p.text}</span>
          ) : (
            <Fragment key={i}>{p.text}</Fragment>
          )
        )}
      </code>
    </pre>
  );
}
