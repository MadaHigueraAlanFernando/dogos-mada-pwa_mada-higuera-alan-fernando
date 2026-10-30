# Dogos Mada — PWA de ventas

| Dato | Valor |
|---|---|
| **Alumno** | MADA HIGUERA ALAN FERNANDO |
| **Grupo** | ING10-1 |
| **Negocio · giro** | Dogos Mada · hot dogs sonorenses |
| **URL del repositorio** | https://github.com/MadaHigueraAlanFernando/dogos-mada-pwa_mada-higuera-alan-fernando.git|
| **URL de GitHub Pages** |  https://madahigueraalanfernando.github.io/dogos-mada-pwa_mada-higuera-alan-fernando/ |

## Historial de avances

| Avance | Hash del commit entregado | Fecha |
|---|---|---|
| 1 | (78e309383951a55b9333ebf9ee930c943f4026fb) | 11/10/2026 |
| 2 | (fe71cd331a261218f5d94546af2dc55a6b1fb2fd) | 18/10/2026 |
| 3 | (d37af873ebdaa8d92cfec9b113525e410669963b) | 25/10/2026 |
| 4 | (se escribe en el reporte PDF) | 01/11/2026|

## ¿Qué es el proyecto?

Dogos Mada es una aplicación web progresiva (PWA) para vender hot dogs sonorenses. Muestra el catálogo de 15 productos con foto y precio, deja armar un pedido en el carrito y se puede instalar en el celular o en la computadora como si fuera una app normal, incluso funciona sin internet.

## ¿Qué incluye?

- Catálogo de 15 productos cargado desde `catalogo.json` (renderizado del lado del cliente, CSR).
- Carrito de compras que se guarda en el navegador y se sincroniza al recuperar la conexión.
- Indicador de estado de conexión (en línea / sin conexión).
- Notificaciones del navegador.
- Geolocalización para ubicar al cliente.
- `manifest.json` con nombre, colores e íconos de 192 y 512 px para poder instalarla.
- Service Worker generado con Workbox (`sw.js`) que precachea la página, el catálogo y las fotos para usarla offline.
- Carpeta `servidor-ssr/` con una versión en Django que renderiza el catálogo en el servidor (SSR), usada para comparar SSR vs CSR.

## Guía de instalación

### 1. Probarlo en local con Live Server

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/MadaHigueraAlanFernando/dogos-mada-pwa_mada-higuera-alan-fernando.git
   ```
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar la extensión **Live Server** si no se tiene.
4. Dar clic derecho sobre `index.html` → **Open with Live Server**.
5. Se abre en el navegador (por ejemplo `http://127.0.0.1:5500`) y ya se puede navegar el catálogo y usar el carrito.

### 2. Probar la versión SSR con Django (opcional)

1. Tener Python instalado y entrar a la carpeta del servidor:
   ```bash
   cd servidor-ssr
   python -m venv venv
   venv\Scripts\activate
   pip install django
   ```
2. Levantar el servidor:
   ```bash
   python manage.py runserver
   ```
3. Abrir `http://127.0.0.1:8000/catalogo/` para ver el catálogo generado desde el servidor.

### 3. Instalar la app desde la URL publicada

La instalación se hace desde GitHub Pages, no desde Live Server.

**En el celular (Android con Chrome):**
1. Abrir https://madahigueraalanfernando.github.io/dogos-mada-pwa_mada-higuera-alan-fernando/
2. Tocar el menú de los tres puntos → **Agregar a la pantalla principal** / **Instalar app**.
3. Confirmar con **Instalar**.
4. Abrir Dogos Mada desde el ícono que aparece en la pantalla de inicio; se abre en pantalla completa, sin la barra del navegador.

**En la computadora (Chrome o Edge):**
1. Abrir la misma URL.
2. Dar clic en el ícono de instalar que aparece en la barra de direcciones (o menú → **Instalar Dogos Mada**).
3. Confirmar con **Instalar**; la app se abre en su propia ventana y queda en el menú de inicio.

### 4. Actualizar el Service Worker después de un cambio

Cada vez que se modifique un archivo de la app (HTML, CSS, JS o imágenes) hay que regenerar el Service Worker desde la carpeta donde está `index.html`:

```bash
npx workbox-cli generateSW workbox-config.js
```

Después se suben los cambios con `git push` para que GitHub Pages publique la versión nueva.


## Comparación SSR vs CSR

### SSR (Django): los productos llegan escritos en el HTML
![Código fuente SSR](docs/captura-ssr.png)

### CSR (JavaScript): el div del catálogo llega vacío
![Código fuente CSR](docs/captura-csr.png)

## Funciones PWA (avance 3)

### index.html: manifest y registro del Service Worker activos
![Código fuente index.html](docs/captura-index-pwa.png)

### sw.js: Workbox precachea el catálogo y las fotos
![Código fuente sw.js](docs/captura-sw.png)

## Auditoría Lighthouse (avance 4)

Auditoría hecha sobre la URL publicada en GitHub Pages con `npx lighthouse`.

| Reporte | Performance | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| [Móvil](docs/lighthouse-movil.html) | 95 | 100 | 100 | 100 |
| [Escritorio](docs/lighthouse-escritorio.html) | 98 | 100 | 100 | 100 |
