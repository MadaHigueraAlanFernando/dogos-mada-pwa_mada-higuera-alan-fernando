import json

from django.conf import settings
from django.shortcuts import render


def vista_ssr(request):
    archivo_catalogo = settings.BASE_DIR.parent / "catalogo.json"
    with archivo_catalogo.open(encoding="utf-8") as archivo:
        productos = json.load(archivo)

    categorias = {}
    for producto in productos:
        producto["imagen_static"] = producto["imagen"].removeprefix("img/")
        categorias.setdefault(producto["categoria"], []).append(producto)

    contexto = {
        "categorias": [
            {"nombre": nombre, "productos": productos_categoria}
            for nombre, productos_categoria in categorias.items()
        ]
    }
    return render(request, 'catalogo/catalogo_ssr.html', contexto)
