/**
 * Cliente de POST /api/run (contrato en docs/api.md).
 * En desarrollo, Vite redirige /api al backend en http://localhost:8080 (vite.config.js).
 * Siempre devuelve un objeto con la forma del contrato, también cuando no hay conexión,
 * para que la consola tenga un solo caso que pintar.
 */
const TIMEOUT_MS = 15_000;

function errorLocal(type, message) {
  return { ok: false, output: [], trace: [], errors: [{ type, line: null, col: null, message }], timeMs: 0 };
}

export async function ejecutarPrograma(code, input) {
  const control = new AbortController();
  const timer = setTimeout(() => control.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, input }),
      signal: control.signal,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // El cuerpo no es JSON: típicamente el proxy de Vite sin backend detrás.
    }

    // 200 (ejecución) y 400 (petición inválida) traen el formato del contrato.
    if (data && Array.isArray(data.errors)) {
      return {
        ok: Boolean(data.ok),
        output: data.output ?? [],
        trace: data.trace ?? [],
        errors: data.errors,
        timeMs: data.timeMs ?? 0,
      };
    }
    return errorLocal(
      'conexion',
      `El servidor respondió ${res.status} sin un resultado válido. ¿Está corriendo el backend en el puerto 8080?`
    );
  } catch (e) {
    if (e.name === 'AbortError') {
      return errorLocal('conexion', `El intérprete no respondió en ${TIMEOUT_MS / 1000} s.`);
    }
    return errorLocal(
      'conexion',
      'No se pudo conectar con el intérprete. Inicia el backend con: cd backend; mvn spring-boot:run'
    );
  } finally {
    clearTimeout(timer);
  }
}
