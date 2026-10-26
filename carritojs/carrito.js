class Carrito {
    constructor(datos) {
        this.divisa = datos.currency || "€";

        this.productos = datos.products.map(producto => ({
            sku: producto.SKU,
            titulo: producto.title,
            precio: Number(producto.price),
            cantidad: 0
        }));
    }

    actualizarUnidades(sku, unidades) {
        const producto = this.productos.find(
            producto => producto.sku === sku
        );

        if (!producto) {
            throw new Error("Producto no encontrado");
        }

        unidades = Number(unidades);

        if (!Number.isInteger(unidades) || unidades < 0) {
            throw new Error("La cantidad no es válida");
        }

        producto.cantidad = unidades;
    }

    obtenerInformacionProducto(sku) {
        const producto = this.productos.find(
            producto => producto.sku === sku
        );

        if (!producto) {
            return null;
        }

        return { ...producto };
    }

    obtenerCarrito() {
        const productosSeleccionados = this.productos
            .filter(producto => producto.cantidad > 0)
            .map(producto => ({
                ...producto,
                subtotal: Number(
                    (producto.precio * producto.cantidad).toFixed(2)
                )
            }));

        const total = productosSeleccionados.reduce(
            (suma, producto) => suma + producto.subtotal,
            0
        );

        return {
            total: total.toFixed(2),
            divisa: this.divisa,
            productos: productosSeleccionados
        };
    }
}

export default Carrito;