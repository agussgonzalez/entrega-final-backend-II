import cartManager from '../dao/mongodb/cartDao.js';
import ticketService from '../services/ticketService.js';
import { ProductDTO } from '../dtos/product.dto.js';

export const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    
    try {
        const cart = await cartManager.getCartById(cartId); // Verificar si el carrito existe
        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        const failedProducts = [];

        for (const item of cart.products) {
            const product = await productManager.getProductById(item.productId);
            if (!product) {
                failedProducts.push(new ProductDTO({ id: item.productId, message: "Producto no encontrado" }));
                continue; // Saltar si el producto no existe
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity; // Reduce el stock
                totalAmount += product.price * item.quantity; // Suma al total
                await product.save(); // Guarda los cambios
            } else {
                failedProducts.push(new ProductDTO(product)); // Usando el DTO
            }
        }

        if (totalAmount > 0) {
            const ticket = {
                code: generateUniqueCode(), // Implementa una función para generar códigos únicos
                amount: totalAmount,
                purchaser: req.user.email,
            };
            await ticketService.createTicket(ticket); // Guarda el ticket
        }

        // Filtra el carrito para que solo tenga los productos que no se pudieron comprar
        cart.products = cart.products.filter(item => !failedProducts.some(fp => fp.id === item.productId));
        await cart.save(); // Guarda el carrito actualizado

        res.json({ message: 'Compra procesada', failedProducts });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).send({ error: 'Error al procesar la compra', details: error.message });
    }
};
