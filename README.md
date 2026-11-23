# GreenCode

Plataforma web para aprender y ejecutar GreenCode, un lenguaje para automatizar invernaderos (archivos `.grc`).
Proyecto de Lenguajes y Autómatas II, Instituto Tecnológico de Morelia.

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

Instrucciones de instalación y ejecución: pendientes (E4).
