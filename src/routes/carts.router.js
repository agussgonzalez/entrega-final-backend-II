import { Router } from "express";
import { cartManager } from "../app.js";
import mongoose from "mongoose";
import { purchaseCart } from '../controllers/cartController.js';
import { isUser } from '../middlewares/authMiddleware.js';

const cartsRouter = Router();

// Crear nuevo carrito
cartsRouter.post("/", async (req, res) => {
    try {
        const response = await cartManager.newCart();
        res.json(response);
    } catch (error) {
        res.status(500).send("Error al crear carrito");
    }
});

// Obtener productos del carrito
cartsRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const response = await cartManager.getCartProducts(cid);
        res.json(response);
    } catch (error) {
        res.status(500).send("Error al intentar enviar los productos del carrito");
    }
});

// Agregar producto al carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        if (!cid || !pid) {
            return res.status(400).send({ error: "ID de carrito o producto faltante" });
        }

        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send({ error: "ID de carrito o producto no válido" });
        }

        await cartManager._addProductToCart(cid, pid);
        res.status(200).send("Producto agregado exitosamente");
    } catch (error) {
        console.error('Error en la ruta /carts/:cid/products/:pid:', error);
        res.status(500).send({
            error: "Error al intentar guardar producto en el carrito",
            details: error.message
        });
    }
});

// Eliminar producto del carrito
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const result = await cartManager.removeProductFromCart(cid, pid);
        if (result) {
            res.send("Producto eliminado del carrito con éxito");
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        console.error(`Error al eliminar el producto del carrito ${cid}:`, error.message);
        res.status(500).send(`Error al eliminar el producto del carrito ${cid}`);
    }
});

// Actualizar el carrito
cartsRouter.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; 
    try {
        const result = await cartManager.updateCart(cid, products);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        console.error(`Error al actualizar el carrito ${cid}:`, error.message);
        res.status(500).send(`Error al actualizar el carrito ${cid}`);
    }
});

// Actualizar cantidad de producto en el carrito
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const result = await cartManager.updateProductQuantity(cid, pid, quantity);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        console.error(`Error al actualizar la cantidad del producto en el carrito ${cid}:`, error.message);
        res.status(500).send(`Error al actualizar la cantidad del producto en el carrito ${cid}`);
    }
});

// Vaciar carrito
cartsRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartManager.clearCart(cid);
        if (result) {
            res.send("Carrito vacío con éxito");
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        console.error(`Error al vaciar el carrito ${cid}:`, error.message);
        res.status(500).send(`Error al vaciar el carrito ${cid}`);
    }
});

// Procesar compra del carrito
cartsRouter.post('/:cid/purchase', isUser, purchaseCart);

export { cartsRouter };
