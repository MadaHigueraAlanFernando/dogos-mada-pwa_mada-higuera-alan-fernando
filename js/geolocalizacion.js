// Obtiene la ubicación solo después de que el usuario lo solicita y muestra
// una ruta aproximada hasta la sucursal de Dogos Mada.
const SUCURSAL = {
  nombre: "Dogos Mada",
  lat: 29.00921146687666,
  lon: -110.90377522502918,
};

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const radioTierraKm = 6371;
  const aRadianes = (grados) => (grados * Math.PI) / 180;

  const dLat = aRadianes(lat2 - lat1);
  const dLon = aRadianes(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radioTierraKm * c;
}

async function obtenerRuta(origenLat, origenLon) {
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${origenLon},${origenLat};${SUCURSAL.lon},${SUCURSAL.lat}` +
    "?overview=full&geometry=geojson";
  const controlador = new AbortController();
  const tiempoLimite = setTimeout(() => controlador.abort(), 10000);

  try {
    const respuesta = await fetch(url, { signal: controlador.signal });
    if (!respuesta.ok) {
      throw new Error(`El servicio de rutas respondió con HTTP ${respuesta.status}.`);
    }

    const datos = await respuesta.json();
    const ruta = datos.routes?.[0];
    if (
      datos.code !== "Ok" ||
      !Array.isArray(ruta?.geometry?.coordinates) ||
      ruta.geometry.coordinates.length === 0
    ) {
      return null;
    }

    return {
      coords: ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      distanciaKm: ruta.distance / 1000,
      duracionMin: ruta.duration / 60,
    };
  } catch (error) {
    console.error("No se pudo calcular la ruta:", error);
    return null;
  } finally {
    clearTimeout(tiempoLimite);
  }
}

let mapa;

function dibujarMapa(origenLat, origenLon, coordsRuta) {
  const contenedor = document.getElementById("mapa-ruta");
  if (!contenedor) {
    throw new Error("No se encontró el contenedor del mapa.");
  }
  if (typeof L === "undefined") {
    throw new Error("No se pudo cargar la librería del mapa.");
  }

  contenedor.hidden = false;

  if (!mapa) {
    mapa = L.map(contenedor);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; colaboradores de OpenStreetMap",
      maxZoom: 19,
    }).addTo(mapa);
  } else {
    mapa.eachLayer((capa) => {
      if (capa instanceof L.Marker || capa instanceof L.Polyline) mapa.removeLayer(capa);
    });
  }

  const puntoUsuario = [origenLat, origenLon];
  const puntoSucursal = [SUCURSAL.lat, SUCURSAL.lon];

  L.marker(puntoUsuario).addTo(mapa).bindPopup("Tú estás aquí").openPopup();
  L.marker(puntoSucursal).addTo(mapa).bindPopup(SUCURSAL.nombre);

  const hayRuta = Array.isArray(coordsRuta) && coordsRuta.length > 0;
  const linea = hayRuta ? coordsRuta : [puntoUsuario, puntoSucursal];
  const estiloLinea = hayRuta
    ? { color: "#CA8A04", weight: 5 }
    : { color: "#DC2626", weight: 3, dashArray: "6 6" };

  L.polyline(linea, estiloLinea).addTo(mapa);
  mapa.fitBounds(L.latLngBounds([puntoUsuario, puntoSucursal]), { padding: [30, 30] });
  setTimeout(() => mapa.invalidateSize(), 0);
}

function mostrarResultado(mensaje, texto, urlMapa, detalleRuta) {
  const enlace = document.createElement("a");
  enlace.href = urlMapa;
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
  enlace.textContent = "Abrir en el mapa";

  mensaje.replaceChildren(
    document.createTextNode(texto),
    document.createElement("br")
  );

  if (detalleRuta) {
    const detalle = document.createElement("strong");
    detalle.textContent = detalleRuta;
    mensaje.append(detalle, document.createTextNode(" · "));
  }

  mensaje.append(enlace);
}

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-ubicacion");
  const mensaje = document.getElementById("ubicacion-mensaje");
  if (!boton || !mensaje) return;

  boton.addEventListener("click", () => {
    if (!window.isSecureContext) {
      mensaje.textContent = "La ubicación requiere HTTPS o abrir el sitio desde localhost.";
      return;
    }
    if (!("geolocation" in navigator)) {
      mensaje.textContent = "Este dispositivo no reporta ubicación.";
      return;
    }

    boton.disabled = true;
    mensaje.textContent = "Buscando tu ubicación…";

    navigator.geolocation.getCurrentPosition(
      async (posicion) => {
        try {
          const { latitude, longitude } = posicion.coords;
          const mapaUrl =
            `https://www.openstreetmap.org/directions?from=${latitude}%2C${longitude}` +
            `&to=${SUCURSAL.lat}%2C${SUCURSAL.lon}`;

          mensaje.textContent = "Calculando la ruta hasta la sucursal…";
          const ruta = await obtenerRuta(latitude, longitude);
          dibujarMapa(latitude, longitude, ruta ? ruta.coords : null);

          if (ruta) {
            mostrarResultado(
              mensaje,
              `Ruta hasta ${SUCURSAL.nombre}: `,
              mapaUrl,
              `${ruta.distanciaKm.toFixed(1)} km · ~${Math.round(ruta.duracionMin)} min en auto`
            );
          } else {
            const distanciaKm = calcularDistanciaKm(
              latitude,
              longitude,
              SUCURSAL.lat,
              SUCURSAL.lon
            );
            mostrarResultado(
              mensaje,
              `No se pudo calcular la ruta por calles; línea recta hasta ${SUCURSAL.nombre}: `,
              mapaUrl,
              `${distanciaKm.toFixed(1)} km`
            );
          }
        } catch (error) {
          console.error("No se pudo mostrar la ubicación o el mapa:", error);
          mensaje.textContent = "No se pudo mostrar el mapa. Intenta de nuevo más tarde.";
        } finally {
          boton.disabled = false;
        }
      },
      (error) => {
        const mensajesError = {
          1: "No se concedió permiso para acceder a la ubicación.",
          2: "No se pudo determinar la ubicación del dispositivo.",
          3: "La búsqueda de ubicación tardó demasiado. Intenta de nuevo.",
        };
        mensaje.textContent =
          mensajesError[error.code] || "Ocurrió un error al obtener tu ubicación.";
        boton.disabled = false;
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  });
});