// Muestra una notificación de prueba del navegador cuando el usuario lo solicita.

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-notificar");
  const mensaje = document.getElementById("notificaciones-mensaje");
  if (!boton || !mensaje) return;

  boton.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      mensaje.textContent = "Este navegador no soporta notificaciones.";
      return;
    }
    if (!window.isSecureContext) {
      mensaje.textContent = "Las notificaciones requieren HTTPS o abrir el sitio desde localhost.";
      return;
    }

    boton.disabled = true;
    try {
      const permiso =
        Notification.permission === "default"
          ? await Notification.requestPermission()
          : Notification.permission;

      if (permiso === "granted") {
        new Notification("Dogos Mada", {
          body: "¡Dogos Mada ya puede mostrarte avisos en este dispositivo!",
          icon: "icons/icon-192.png",
        });
        mensaje.textContent = "Notificaciones activadas en este dispositivo.";
      } else if (permiso === "denied") {
        mensaje.textContent =
          "Las notificaciones están bloqueadas. Puedes habilitarlas desde la configuración del navegador.";
      } else {
        mensaje.textContent = "No se concedió permiso para las notificaciones.";
      }
    } catch (error) {
      console.error("No se pudo mostrar la notificación:", error);
      mensaje.textContent = "No se pudo activar la notificación. Intenta de nuevo.";
    } finally {
      boton.disabled = false;
    }
  });
});