// Muestra en el encabezado si hay conexión (conectado / sin conexión).
document.addEventListener("DOMContentLoaded", () => {
  const estado = document.getElementById("estado-conexion");
  if (!estado) return;

  function actualizarEstado() {
    const conectado = navigator.onLine;
    estado.textContent = conectado ? "conectado" : "sin conexión";
    estado.classList.toggle("sin-conexion", !conectado);
  }

  window.addEventListener("online", actualizarEstado);
  window.addEventListener("offline", actualizarEstado);
  actualizarEstado();
});
