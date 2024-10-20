// src/dtos/CartDTO.js

class CartDTO {
    constructor(cart) {
        this.id = cart._id; // id autogenerado por MongoDB
        this.products = cart.products.map(product => ({
            id: product._id,
            productId: product.product, // solo envia el id del producto
            thumbnails: product.product.thumbnails[0],
            quantity: product.quantity // Solo envía la cantidad de cada producto
        }));
    }
}

export default CartDTO;
