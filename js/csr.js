// csr.js — Renderizado en el Cliente (CSR)
// "CSR" significa que el HTML llega casi vacío y es ESTE archivo JavaScript,
// ya corriendo en el navegador del usuario, quien construye el contenido.

// 1) Buscamos el contenedor vacío que dejamos en index.html
const contenedorCatalogo = document.getElementById("catalogo");

// 2) fetch() le pide el archivo catalogo.json al servidor (aquí simula una API real).
//    fetch() devuelve una "promesa": un valor que llegará más adelante, no de inmediato.
fetch("catalogo.json")
  .then((respuesta) => respuesta.json()) // convierte el texto recibido en un array de objetos JS
  .then((productos) => {
    // 3) Ya tenemos los productos: borramos las tarjetas esqueleto y dibujamos las reales
    contenedorCatalogo.replaceChildren();
    contenedorCatalogo.classList.replace("grid", "catalogo-categorias");
    contenedorCatalogo.removeAttribute("aria-busy");
    contenedorCatalogo.removeAttribute("aria-label");

    const productosPorCategoria = new Map();
    productos.forEach((producto) => {
      if (!productosPorCategoria.has(producto.categoria)) {
        productosPorCategoria.set(producto.categoria, []);
      }
      productosPorCategoria.get(producto.categoria).push(producto);
    });

    productosPorCategoria.forEach((productosCategoria, categoria) => {
      const grupo = document.createElement("section");
      grupo.className = "categoria-catalogo";

      const titulo = document.createElement("h3");
      titulo.className = "categoria-catalogo__titulo";
      titulo.textContent = categoria;
      grupo.appendChild(titulo);

      const grid = document.createElement("div");
      grid.className = "grid";

      productosCategoria.forEach((producto) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto";

        const imagen = document.createElement("img");
        imagen.className = "producto__foto";
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.loading = "lazy";

        const nombre = document.createElement("strong");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("span");
        precio.className = "precio";
        precio.textContent = `$${producto.precio}`;

        const stock = document.createElement("p");
        stock.textContent = `Stock: ${producto.stock}`;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.dataset.id = producto.id;
        boton.textContent = "Agregar al carrito";
        boton.addEventListener("click", () => {
          agregarAlCarrito(producto);
        });

        tarjeta.append(imagen, nombre, precio, stock, boton);
        grid.appendChild(tarjeta);
      });

      grupo.appendChild(grid);
      contenedorCatalogo.appendChild(grupo);
    });
  })
  .catch((error) => {
    // si algo falla (por ejemplo, sin conexión y sin caché), avisamos en pantalla
    contenedorCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
    contenedorCatalogo.removeAttribute("aria-busy");
    contenedorCatalogo.removeAttribute("aria-label");
    console.error("Error al cargar catálogo:", error);
  });