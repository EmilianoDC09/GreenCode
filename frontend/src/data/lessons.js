import sintaxis from '../ejemplos/01_sintaxis.grc?raw';
import tipos from '../ejemplos/02_tipos.grc?raw';
import operadores from '../ejemplos/03_operadores.grc?raw';
import decision from '../ejemplos/04_decision.grc?raw';
import repeticion from '../ejemplos/05_repeticion.grc?raw';
import entradaSalida from '../ejemplos/06_entrada_salida.grc?raw';
import injertos from '../ejemplos/07_injertos.grc?raw';

export const LESSONS = [
  {
    id: 'sintaxis',
    titulo: 'Primeros pasos',
    resumen: 'Conoce la estructura parcela … cosecha y ejecuta tu primera instrucción.',
    tip: 'Las sentencias simples terminan en punto y coma; los bloques van entre corchetes [ ]. Comentarios: >> para una línea y &> … <& para varias.',
    archivo: '01_sintaxis.grc',
    codigo: sintaxis,
    salida: ['Hola, campo'],
  },
  {
    id: 'tipos',
    titulo: 'Tipos y variables',
    resumen: 'Clima, semilla, actuador y contexto. Haz brotar tus primeras variables.',
    tip: 'brotar #nombre tipo <tipo> : valor; declara una variable. Los nombres empiezan con #. clima son decimales (24.5), semilla enteros (15), actuador encendido/apagado y contexto texto entre comillas. Sin valor, brota con 0, 0.0, apagado o "". Un actuador se muestra como true/false.',
    archivo: '02_tipos.grc',
    codigo: tipos,
    salida: [
      'Cultivo: Jitomate',
      'Temperatura: 24.5',
      'Minutos de riego: 15',
      'Ventilador encendido: false',
      'Lecturas: 0',
    ],
  },
  {
    id: 'operadores',
    titulo: 'Asignación y operadores',
    resumen: 'Nutrir valores y comparar condiciones con supera, debajo, fusion y relevo.',
    tip: 'nutrir #var : expresión; cambia el valor de una variable que ya brotó. Las comparaciones y los operadores lógicos devuelven un actuador. Con + también se une texto: "Temp: " + #temp.',
    archivo: '03_operadores.grc',
    codigo: operadores,
    salida: [
      'Temperatura: 26.5',
      'Riegos del día: 6',
      'Hace calor: true',
      'Suelo seco: false',
      'Seis riegos: true',
      'Alerta (calor y suelo seco): false',
      'Revisar: true',
    ],
  },
  {
    id: 'decision',
    titulo: 'Decisiones',
    resumen: 'Monitorear con florece, marchita y reposo según el estado del invernadero.',
    tip: 'florece se ejecuta si la primera condición se cumple; marchita (puede haber varios) prueba otra condición; reposo va al final y se ejecuta si ninguna se cumplió. Las estructuras de control no llevan punto y coma.',
    archivo: '04_decision.grc',
    codigo: decision,
    salida: ['Suelo seco: riego corto', 'Bomba encendida: true'],
  },
  {
    id: 'repeticion',
    titulo: 'Repeticiones',
    resumen: 'Automatiza rutinas con regar (mientras) y madurar (por pasos).',
    tip: 'regar (condición) [ … ] repite mientras la condición sea cierta: cambia la variable dentro del ciclo o nunca terminará. madurar (#var desde A hasta B paso C) cuenta con enteros; paso es opcional y vale 1.',
    archivo: '05_repeticion.grc',
    codigo: repeticion,
    salida: [
      'Regando... humedad: 30',
      'Regando... humedad: 40',
      'Regando... humedad: 50',
      'Revisión del día 1',
      'Revisión del día 3',
      'Revisión del día 5',
      'Revisión del día 7',
    ],
  },
  {
    id: 'entrada-salida',
    titulo: 'Entrada y salida',
    resumen: 'Lee lecturas con captar y muestra resultados con emitir.',
    tip: 'captar #var; lee un valor del campo Entrada del editor (uno por línea, en orden) y lo convierte al tipo de la variable, que debe haber brotado antes. emitir muestra cualquier expresión en la consola.',
    archivo: '06_entrada_salida.grc',
    codigo: entradaSalida,
    entrada: 'Invernadero Norte\n32.5\n',
    salida: ['Lote: Invernadero Norte', 'Temperatura leída: 32.5', 'Abrir ventilas de Invernadero Norte'],
  },
  {
    id: 'injertos',
    titulo: 'Injertos (funciones)',
    resumen: 'Agrupa lógica en un injerto que produce un tipo y devuelve su fruto.',
    tip: 'injerto nombre (#param tipo t, …) produce tipo [ … ] se declara antes de la parcela. fruto devuelve el resultado y termina el injerto. Dentro solo se ven sus parámetros, no las variables de la parcela.',
    archivo: '07_injertos.grc',
    codigo: injertos,
    salida: ['Litros que faltan: 18', 'Temperatura crítica: true'],
  },
];

