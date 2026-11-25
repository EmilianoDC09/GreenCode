import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

/**
 * Resaltado de GreenCode para CodeMirror 6.
 * Reconoce los mismos tokens que backend/src/main/antlr4/com/greencode/greenCode.g4.
 * Solo colorea: la validación real la hace el intérprete Java.
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

/** Avanza dentro de un comentario de bloque &> ... <& (puede abarcar varias líneas). */
function dentroDeBloque(stream, state) {
  if (stream.skipTo('<&')) {
    stream.match('<&');
    state.enBloque = false;
  } else {
    stream.skipToEnd();
  }
  return 'blockComment';
}

const greencodeLanguage = StreamLanguage.define({
  name: 'greencode',
  startState: () => ({ enBloque: false }),
  copyState: (s) => ({ enBloque: s.enBloque }),
  token(stream, state) {
    if (state.enBloque) return dentroDeBloque(stream, state);
    if (stream.eatSpace()) return null;

    if (stream.match('&>')) {
      state.enBloque = true;
      return dentroDeBloque(stream, state);
    }
    if (stream.match('>>')) {
      stream.skipToEnd();
      return 'lineComment';
    }
    if (stream.match(/^"[^"]*"?/)) return 'string';
    if (stream.match(/^#[A-Za-z][A-Za-z0-9_]*/)) return 'variableName';
    if (stream.match(/^\d+\.\d+/) || stream.match(/^\d+/)) return 'number';
    if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) {
      const w = stream.current();
      if (KEYWORDS.has(w)) return 'keyword';
      if (TYPES.has(w)) return 'typeName';
      if (WORD_OPS.has(w)) return 'operatorKeyword';
      if (LITERALS.has(w)) return 'bool';
      return 'variableName.function'; // nombre de parcela o de injerto
    }
    if (stream.match(/^[+\-*/:]/)) return 'operator';
    if (stream.match(/^[[\]()]/)) return 'bracket';
    if (stream.match(/^[;,]/)) return 'punctuation';

    stream.next();
    return 'invalid'; // carácter que el lexer de GreenCode no reconoce
  },
  languageData: {
    commentTokens: { line: '>>', block: { open: '&>', close: '<&' } },
  },
});

/** Mismos colores que los bloques de solo lectura (variables --code-* de global.css). */
const greencodeHighlight = HighlightStyle.define([
  { tag: t.keyword, color: 'var(--code-kw)' },
  { tag: t.typeName, color: 'var(--code-type)' },
  { tag: t.variableName, color: 'var(--code-var)' },
  { tag: t.function(t.variableName), color: '#ffffff' },
  { tag: t.string, color: 'var(--code-str)' },
  { tag: [t.number, t.bool], color: 'var(--code-num)' },
  { tag: t.operatorKeyword, color: 'var(--code-op)', fontStyle: 'italic' },
  { tag: t.operator, color: 'var(--code-op)' },
  { tag: [t.lineComment, t.blockComment], color: 'var(--code-com)', fontStyle: 'italic' },
  { tag: t.invalid, color: '#ff8a80', textDecoration: 'underline wavy' },
]);

/** Apariencia del editor alineada con el panel oscuro de editor.css. */
export const greencodeTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent',
      color: '#e6f1ea',
      fontSize: '13.5px',
      height: '100%',
    },
    '.cm-scroller': {
      fontFamily: 'var(--font-mono)',
      lineHeight: '24px',
    },
    '.cm-content': {
      padding: '20px 0',
      caretColor: 'var(--sprout-400)',
    },
    '.cm-line': { padding: '0 20px 0 14px' },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'rgba(167, 194, 179, 0.45)',
      borderRight: '1px solid var(--line-dark)',
    },
    '.cm-gutterElement': { padding: '0 10px 0 14px !important' },
    '.cm-activeLine': { backgroundColor: 'rgba(255, 255, 255, 0.035)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#e6f1ea' },
    '&.cm-focused': { outline: 'none' },
    '&.cm-focused .cm-cursor': { borderLeftColor: 'var(--sprout-400)' },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: 'rgba(79, 214, 119, 0.25)' },
    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: 'rgba(79, 214, 119, 0.18)',
      outline: '1px solid rgba(79, 214, 119, 0.4)',
    },
  },
  { dark: true }
);

/** Extensiones para <CodeMirror extensions={...} />. */
export const greencode = [greencodeLanguage, syntaxHighlighting(greencodeHighlight)];
export { greencodeLanguage };
