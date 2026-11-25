import sintaxis from '../ejemplos/01_sintaxis.grc?raw';

export const LESSONS = [
  {
    id: 'sintaxis',
    titulo: 'Primeros pasos',
    resumen: 'Conoce la estructura parcela … cosecha y ejecuta tu primera instrucción.',
    tip: 'Las sentencias simples terminan en punto y coma; los bloques van entre corchetes [ ]. Comentarios: >> para una línea y &> … <& para varias.',
    archivo: 'hola_campo.grc',
    codigo: sintaxis,
  },
  {
    id: 'tipos',
    titulo: 'Tipos y variables',
    resumen: 'clima, semilla, actuador y contexto. Haz brotar tus primeras variables.',
  },
  {
    id: 'operadores',
    titulo: 'Asignación y operadores',
    resumen: 'nutrir valores y comparar condiciones con supera, debajo, fusion y relevo.',
  },
  {
    id: 'decision',
    titulo: 'Decisiones',
    resumen: 'monitorear con florece, marchita y reposo según el estado del invernadero.',
  },
  {
    id: 'repeticion',
    titulo: 'Repeticiones',
    resumen: 'Automatiza rutinas con regar (mientras) y madurar (por pasos).',
  },
  {
    id: 'entrada-salida',
    titulo: 'Entrada y salida',
    resumen: 'Lee lecturas con captar y muestra resultados con emitir.',
  },
  {
    id: 'injertos',
    titulo: 'Injertos (funciones)',
    resumen: 'Agrupa lógica en un injerto que produce un tipo y devuelve su fruto.',
  },
];
