import express from "express";
import { Router } from "express";
const router = express.Router();
import { ProductManager } from "../dao/db/product-manager-db.js";
const manager = new ProductManager();
import { CartManager } from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();
import isAdmin from "../middlewares/authMiddleware.js";
import ticketService from '../services/ticketService.js';  // Importa el servicio de tickets
import TicketDTO from '../dtos/ticketDto.js';  // Importa el DTO
import User from '../dao/models/user.model.js';  // Importa el modelo de User

router.get("/products", async (req, res) => {
    try {
        // Obtener parámetros de consulta, proporcionando valores predeterminados si no se especifican
        const limit = parseInt(req.query.limit) || 9; // Número de productos por página
        const page = parseInt(req.query.page) || 1; // Página actual
        const skip = (page - 1) * limit; // Número de productos a omitir
        const sortOrder = req.query.sortOrder || null; // Orden de los productos
        const filter = req.query.filter || {}; // Filtros aplicados

        const username = req.session.username; // Obtén el nombre del usuario
    req.session.username = null; // Limpia la sesión para no mostrar el mensaje de nuevo

        // Obtener los productos con paginación
        const productos = await manager.getProducts({
            limit,
            skip,
            sortOrder,
            filter
        });

        // Contar el total de productos para calcular el número total de páginas
        const totalProducts = await manager.countProducts(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        // Determinar las páginas previa y siguiente
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        // Renderizar la vista con los datos necesarios
        res.render("home", {
            username,
            productos,
            prevPage,
            nextPage,
            sort: sortOrder,
            page,
            totalPages
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos: ' + error.message);
    }
});


router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.render("productDetails", { product: producto });
        }
    } catch (error) {
        res.status(500).send('Error al obtener producto por ID: ' + error.message);
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        res.render("cartDetails", { cart, cid });
    } catch (error) {
        res.status(500).send("Error al obtener el carrito");
    }
});

router.get("/realtimeproducts", isAdmin, (req, res) => {
    res.render("realtimeproducts");
});

router.get('/products/add', (req, res) => {
    res.render('addProduct');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/checkout', (req, res) => {
    try {
        const ticket = req.session.ticket;  // Asume que el ticket está almacenado en la sesión
        if (!ticket) {
            return res.status(400).send('No hay información de ticket disponible');
        }

        // Renderizar la vista de checkout con los datos del ticket
        res.render('checkout', { ticket });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de checkout: ' + error.message);
    }
});


router.post('/checkout', async (req, res) => {
    try {
        const purchaserId = req.session.userId;  // Usamos el ID del comprador de la sesión
        if (!purchaserId) {
            return res.status(401).send('Usuario no autenticado');
        }

        const user = await User.findById(purchaserId);  // Obtenemos al usuario de la base de datos
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const cartItems = req.body.cartItems;  // Supongo que tienes un array de productos en el carrito
        const validProducts = [];  // Almacenará solo los productos con stock suficiente
        let totalAmount = 0;  // Calcula el total

        for (const item of cartItems) {
            const product = await ProductManager.getProductById(item.product_id);  // Busca el producto por ID

            if (!product) {
                continue;  // Si no existe el producto, lo omitimos
            }

            if (item.quantity > product.stock) {
                console.log(`Stock insuficiente para el producto ${product.name}. Cantidad solicitada: ${item.quantity}, stock disponible: ${product.stock}`);
                continue;  // Si la cantidad es mayor al stock, omitimos este producto
            }

            validProducts.push({
                product_id: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;  // Suma el total
            product.stock -= item.quantity;  // Reduce el stock
            await product.save();  // Guarda el cambio en el stock
        }

        if (validProducts.length === 0) {
            return res.status(400).send('No hay productos válidos en el carrito');
        }

        // Datos del ticket
        const ticketData = {
            code: `TICKET${Date.now()}`,  // Genera un código único
            amount: totalAmount,
            purchaser: user.email,  // Utilizamos el email del comprador
            purchaser_id: user._id,  // ID del comprador
            products: validProducts,  // Solo los productos con stock suficiente
            paymentMethod: req.body.paymentMethod,  // Método de pago desde el body (ej: tarjeta)
            shippingDetails: req.body.shippingDetails,  // Detalles de envío desde el body
            taxes: req.body.taxes || 0,  // Impuestos opcionales
        };

        // Crear el ticket usando el servicio
        const ticket = await ticketService.createTicket(ticketData);
        const ticketDTO = new TicketDTO(ticket);

        // Renderiza la vista de checkout pasando los datos del ticket
        res.render('checkout', { ticket: ticketDTO });
    } catch (error) {
        res.status(500).send('Error al procesar la compra: ' + error.message);
    }
});


export { router as viewsRouter };
