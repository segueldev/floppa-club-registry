# Club Felino Floppa — Registro de Socios

Proyecto desarrollado para la Evaluación N°3 de la asignatura **Programación Front End**.

- **Alumno:** Benjamín Seguel
- **Carrera:** Ingeniería en Ciberseguridad
- **Profesor:** Erick Bailey Rebolledo
- **Institución:** INACAP Temuco IEC
- **Año:** 2026

## Descripción

WebApp que muestra un listado de "socios" (datos de usuarios obtenidos desde
[JSONPlaceholder](https://jsonplaceholder.typicode.com/users)) mediante **JQuery DataTables**,
y permite simular el registro de un nuevo socio mediante un formulario con
validaciones en JavaScript.

## Cómo ejecutar el proyecto

> **Importante:** no abrir los archivos con doble clic (`file://`), ya que el navegador
> bloquea las peticiones a la API externa por seguridad. Se debe servir con un servidor local.

### Opción 1: Servidor local con Python

**En Windows:**
```cmd
py -m http.server 8000
```
(si `py` no funciona, probar con `python -m http.server 8000`)

**En Linux / Mac:**
```bash
python3 -m http.server 8000
```

Luego abrir en el navegador: `http://localhost:8000`

### Opción 2: Extensión Live Server (más simple, no requiere terminal)

1. Instalar la extensión **"Live Server"** en Visual Studio Code.
2. Clic derecho sobre `index.html` → **"Open with Live Server"**.
3. Se abrirá automáticamente en el navegador con la URL correcta.

## Estructura del proyecto

- `index.html`          → Página principal, tabla de socios (JQuery DataTables)
- `formulario.html`     → Formulario de registro de nuevo socio
- `css/estilos.css`      → Estilos generales
- `js/tabla.js`          → Inicialización de la DataTable y consumo de la API
- `js/validaciones.js`   → Validaciones del formulario y lógica de envío

## Tecnologías utilizadas

- HTML5 / CSS3
- Bootstrap 5
- JQuery
- JQuery DataTables
- JavaScript (validaciones, manipulación del DOM, Web Audio API)
