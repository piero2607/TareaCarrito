import Carrito from "./Carrito.js";

const API_URL = "https://6adcce36fa5e73d4ab2db887.mockapi.io/api/v1/carrito";

const contenedorProductos = document.getElementById("productos");
const resumenCarrito = document.getElementById("resumen");
const totalCarrito = document.getElementById("total");
const mensaje = document.getElementById("mensaje");

let carrito;

function formatearPrecio(precio) {
    return Number(precio).toFixed(2) + " €";
}

function mostrarProductos(productos) {
    contenedorProductos.replaceChildren();

    productos.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        const titulo = document.createElement("h3");
        titulo.textContent = producto.titulo;

        const precio = document.createElement("p");
        precio.textContent = formatearPrecio(producto.precio);

        const etiqueta = document.createElement("label");
        etiqueta.textContent = "Unidades: ";

        const campoUnidades = document.createElement("input");
        campoUnidades.type = "number";
        campoUnidades.min = "0";
        campoUnidades.step = "1";
        campoUnidades.value = "0";
        campoUnidades.setAttribute(
            "aria-label",
            "Unidades de " + producto.titulo
        );

        campoUnidades.addEventListener("change", () => {
            const unidades = Number(campoUnidades.value);

            if (!Number.isInteger(unidades) || unidades < 0) {
                mensaje.textContent =
                    "Introduce un número entero igual o superior a cero.";
                campoUnidades.value = "0";
                return;
            }

            mensaje.textContent = "";

            carrito.actualizarUnidades(producto.sku, unidades);
            actualizarCarrito();
        });

        etiqueta.appendChild(campoUnidades);
        tarjeta.append(titulo, precio, etiqueta);
        contenedorProductos.appendChild(tarjeta);
    });
}

function actualizarCarrito() {
    const datosCarrito = carrito.obtenerCarrito();

    resumenCarrito.replaceChildren();

    if (datosCarrito.productos.length === 0) {
        const texto = document.createElement("p");
        texto.textContent = "No hay productos seleccionados.";
        resumenCarrito.appendChild(texto);
    } else {
        datosCarrito.productos.forEach(producto => {
            const linea = document.createElement("div");
            linea.className = "linea-carrito";

            const nombre = document.createElement("span");
            nombre.textContent =
                producto.titulo + " x " + producto.cantidad;

            const subtotal = document.createElement("span");
            subtotal.textContent = formatearPrecio(producto.subtotal);

            linea.append(nombre, subtotal);
            resumenCarrito.appendChild(linea);
        });
    }

    totalCarrito.textContent =
        formatearPrecio(datosCarrito.total);
}

async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos.");
        }

        const productosAPI = await respuesta.json();
        console.log("Productos recibidos:", productosAPI);
        console.log("¿Es una lista?", Array.isArray(productosAPI));
       
        const datos = {
            currency: "€",
            products: productosAPI.map(producto => ({
                SKU: producto.SKU ?? producto.sku ?? producto.id,
                title: producto.title ?? producto.titulo,
                price: producto.price ?? producto.precio
            }))
        };

        carrito = new Carrito(datos);
        console.log("Productos preparados:", carrito.productos);

        mostrarProductos(carrito.productos);
        actualizarCarrito();

    } catch (error) {
        console.error(error);
        contenedorProductos.textContent =
            "Error al cargar los productos. Comprueba la URL de la API.";
        mensaje.textContent = error.message;
    }
}

cargarProductos();s