// carrito.js — Almacenamiento local y "sincronización" offline/online
// Aquí usamos localStorage: una caja de guardado que vive DENTRO del navegador
// y sobrevive aunque cierres la pestaña o se vaya el internet.

const CLAVE_CARRITO = "tienda-escolar-carrito";

// Lee el carrito guardado en localStorage (si no hay nada, regresa un array vacío)
function leerCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO); // localStorage solo guarda texto
  return guardado ? JSON.parse(guardado) : []; // JSON.parse convierte ese texto de vuelta a un array
}

// Guarda el array del carrito en localStorage (JSON.stringify lo convierte a texto)
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Agrega un producto al carrito (o le sube la cantidad si ya estaba)
function agregarAlCarrito(producto) {
  const carrito = leerCarrito();
  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  pintarCarrito();
}

// Sube o baja la cantidad de un producto ya en el carrito con los botones +/-;
// si la cantidad llega a 0, el producto se quita solo.
function cambiarCantidad(id, delta) {
  const carrito = leerCarrito();
  const item = carrito.find((item) => item.id === id);
  if (!item) return;

  item.cantidad += delta;
  const actualizado = item.cantidad <= 0 ? carrito.filter((item) => item.id !== id) : carrito;

  guardarCarrito(actualizado);
  pintarCarrito();
}

// Quita un producto del carrito sin importar su cantidad
function quitarDelCarrito(id) {
  const carrito = leerCarrito().filter((item) => item.id !== id);
  guardarCarrito(carrito);
  pintarCarrito();
}

// Dibuja el carrito en pantalla a partir de lo que hay en localStorage.
function pintarCarrito() {
  const carrito = leerCarrito();
  const lista = document.getElementById("carrito-lista");
  const total = document.getElementById("carrito-total");
  const contador = document.getElementById("carrito-cantidad-total");

  lista.replaceChildren();
  let suma = 0;
  let cantidadTotal = 0;

  if (carrito.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "carrito-vacio";
    vacio.textContent = "Tu carrito está vacío.";
    lista.appendChild(vacio);
  }

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    suma += subtotal;
    cantidadTotal += item.cantidad;

    const li = document.createElement("li");
    const nombre = document.createElement("span");
    nombre.className = "carrito-nombre";
    nombre.textContent = item.nombre;

    const controles = document.createElement("span");
    controles.className = "carrito-cantidad";

    const botonRestar = document.createElement("button");
    botonRestar.type = "button";
    botonRestar.dataset.accion = "restar";
    botonRestar.dataset.id = item.id;
    botonRestar.setAttribute("aria-label", `Quitar una unidad de ${item.nombre}`);
    botonRestar.textContent = "−";

    const valorCantidad = document.createElement("span");
    valorCantidad.className = "carrito-cantidad__valor";
    valorCantidad.textContent = item.cantidad;

    const botonSumar = document.createElement("button");
    botonSumar.type = "button";
    botonSumar.dataset.accion = "sumar";
    botonSumar.dataset.id = item.id;
    botonSumar.setAttribute("aria-label", `Agregar una unidad de ${item.nombre}`);
    botonSumar.textContent = "+";

    controles.append(botonRestar, valorCantidad, botonSumar);

    const precio = document.createElement("span");
    precio.className = "carrito-precio";
    precio.textContent = `$${subtotal}`;

    const botonQuitar = document.createElement("button");
    botonQuitar.type = "button";
    botonQuitar.className = "carrito-quitar";
    botonQuitar.dataset.accion = "quitar";
    botonQuitar.dataset.id = item.id;
    botonQuitar.textContent = "Quitar";

    li.append(nombre, precio, controles, botonQuitar);
    lista.appendChild(li);
  });

  total.textContent = suma;
  contador.textContent = cantidadTotal;
}

// Un solo listener en <ul id="carrito-lista"> atiende los clics de TODOS los
// botones +/-/Quitar (delegación de eventos), incluso los que se crean después
// dinámicamente cada vez que pintarCarrito() vuelve a dibujar la lista.
function manejarClicCarrito(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "sumar") cambiarCantidad(id, 1);
  if (boton.dataset.accion === "restar") cambiarCantidad(id, -1);
  if (boton.dataset.accion === "quitar") quitarDelCarrito(id);
}

// "Sincronizar": en una app real esto haría un fetch() con method: "POST" al
// servidor. Aquí lo simulamos para enseñar el patrón offline -> online.
function sincronizarCarrito() {
  const mensaje = document.getElementById("carrito-mensaje");

  if (!navigator.onLine) {
    // navigator.onLine: propiedad del navegador que dice si hay conexión
    mensaje.textContent = "Sin conexión: el carrito se sincronizará cuando vuelva el internet.";
    return;
  }

  // Aquí iría: fetch("https://mi-api.com/carrito", { method: "POST", body: ... })
  mensaje.textContent = "Carrito sincronizado con el servidor (simulado). ✓";
}

document.addEventListener("DOMContentLoaded", () => {
  pintarCarrito();
  document.getElementById("carrito-lista").addEventListener("click", manejarClicCarrito);
  document.getElementById("btn-sincronizar").addEventListener("click", sincronizarCarrito);

  // Estos dos eventos del navegador avisan cuando se pierde o regresa la conexión
  window.addEventListener("online", sincronizarCarrito);
  window.addEventListener("offline", () => {
    document.getElementById("carrito-mensaje").textContent = "Se perdió la conexión.";
  });
});