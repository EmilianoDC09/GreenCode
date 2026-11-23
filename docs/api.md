# Contrato de la API de ejecución

Dueño: Emiliano (E1). Cualquier cambio se avisa al otro integrante antes de hacer merge a `dev`.

## POST /api/run

Ejecuta un programa GreenCode con el intérprete original (ANTLR4 + `greenCodeCustomVisitor`).

### Petición

```json
{ "code": "parcela demo [ emitir \"hola\"; ] cosecha", "input": "25\n" }
```

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `code` | string | sí | Código fuente `.grc` completo. |
| `input` | string | no | Valores para `captar`, uno por línea. |

### Respuesta (HTTP 200 siempre que el programa se haya procesado)

```json
{ "ok": true, "output": ["hola"], "trace": ["Sentencia: salida (emitir)"], "errors": [], "timeMs": 412 }
```

```json
{ "ok": false, "output": [], "trace": [],
  "errors": [{ "type": "semantico", "line": 2, "col": null,
               "message": "no se puede asignar tipo 'contexto' a la variable '#sensor' de tipo 'semilla'." }],
  "timeMs": 380 }
```

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ok` | boolean | `true` si no hubo ningún error. |
| `output` | string[] | Líneas producidas por `emitir`, en orden. Puede traer salida parcial aunque `ok` sea `false`. |
| `trace` | string[] | Traza del Visitor; la consola la muestra solo con "Ver traza". |
| `errors[].type` | string | `lexico`, `sintactico`, `semantico` o `ejecucion`. |
| `errors[].line` | number o null | Línea del error, si se conoce. |
| `errors[].col` | number o null | Columna (solo léxicos y sintácticos). |
| `errors[].message` | string | Mensaje legible para el usuario. |
| `timeMs` | number | Duración de la ejecución. |

### Límites y otros códigos

- Timeout de 5 s: error `ejecucion` "tiempo de ejecución excedido". Salida máxima: 64 KB.
- 400: `code` ausente o vacío. 500: falla del servidor, no del programa.
- Backend en `http://localhost:8080`; frontend de desarrollo en `http://localhost:5173` (Vite redirige `/api`).

## Interfaces del frontend

- **Ejemplos del tutorial (Jesús):** `frontend/src/ejemplos/NN_nombre.grc`, importados en `lessons.js` con `?raw`. La prueba JUnit de E4 recorre esa carpeta.
- **Código al Editor (envía Jesús, recibe Emiliano):** `navigate('/editor', { state: { code } })`. El Editor lee `location.state?.code` y, si no hay, carga el ejemplo inicial.
