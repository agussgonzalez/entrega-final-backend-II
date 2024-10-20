import Cart from '../models/cart.model.js';

class CartDao {
    async getCartById(cartId) {
        return await Cart.findById(cartId).populate('products.product');
    }

    async createCart() {
        const newCart = new Cart();
        return await newCart.save();
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        return await cart.save();
    }

    async purchaseCart(cartId) {
        const cart = await this.getCartById(cartId);
        // Implementar la lógica de compra aquí (ej. verificación de stock, creación de Ticket)
        return cart; // Devuelve el carrito después de la compra
    }
}

export default new CartDao();
