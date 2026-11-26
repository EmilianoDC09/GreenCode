# GreenCode

Plataforma web para aprender y ejecutar GreenCode, un lenguaje para automatizar invernaderos (archivos `.grc`).
Proyecto de Lenguajes y Autómatas II, Instituto Tecnológico de Morelia.

## Requisitos

| Herramienta | Versión mínima | Para qué |
| --- | --- | --- |
| JDK | 17 (probado con 25) | Backend: intérprete y API |
| Maven | 3.6.3 | Compilar y levantar el backend |
| Node.js | 18 (probado con 24) | Frontend con Vite |

`JAVA_HOME` debe apuntar al JDK que usa Maven (`mvn -v` muestra cuál).

## Ejecutar en local

**Windows (un comando):** desde la raíz del repo, `iniciar.cmd` (o doble clic). Abre dos ventanas, una por capa, y el navegador en `http://localhost:5173`.

**Git Bash, Linux o macOS:** `./iniciar.sh`

**A mano, dos terminales:**

```bash
cd backend && mvn spring-boot:run      # API en http://localhost:8080
cd frontend && npm install && npm run dev   # sitio en http://localhost:5173
```

En desarrollo, Vite redirige `/api` al backend (`frontend/vite.config.js`), así que el navegador solo habla con el puerto 5173.

## Estructura

| Carpeta | Contenido | Dueño |
| --- | --- | --- |
| `backend/` | Intérprete original (ANTLR4 + Visitor) y API Spring Boot | Emiliano |
| `frontend/` | Sitio React: landing, tutorial y editor | Jesús (Editor: Emiliano) |
| `docs/` | Contrato de la API | Emiliano |

## Ramas

- `main`: solo recibe merges desde `dev`; los hace el integrador (Emiliano). Etiquetas `parte-1` y `v1.0`.
- `dev`: integración. Solo recibe PRs aprobados por el otro integrante.
- `feature/<entregable>`: una rama por entregable, creada desde `dev`.

Arquitectura, pruebas y modificaciones al intérprete: pendientes (E4).
