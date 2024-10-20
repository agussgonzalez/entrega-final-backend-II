import express from "express";
import mongoose from "mongoose"; // Asegúrate de importar mongoose
import { ProductManager } from "./dao/db/product-manager-db.js";
import { productsRouter } from "./routes/products.router.js";
import { CartManager } from "./dao/db/cart-manager-db.js";
import { cartsRouter } from "./routes/carts.router.js";
import exphbs from 'express-handlebars';
import { viewsRouter } from "./routes/views.router.js";
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
import passport from "passport";
import initializePassport from './config/passport.js';
import sessionRoutes from './routes/sessions.router.js';
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from 'dotenv';
import ticketsRouter from './routes/ticket.router.js';
import { TicketManager } from "./dao/db/ticket.manager.js";

dotenv.config();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const app = express();

// Reemplaza con tus credenciales de MongoDB Atlas
const mongoUrl = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("Error de conexión a MongoDB", error);
        process.exit(1); // Termina el proceso si no puede conectarse
    }
};

connectDB();

export const ticketManager = new TicketManager();

app.engine("handlebars", exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        ifEquals: (arg1, arg2, options) => {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

export const productManager = new ProductManager();
export const cartManager = new CartManager();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "coderhouse",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {secure: false}
}));
app.use(`/api/tickets`, ticketsRouter);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null; // Guardamos el usuario en res.locals
    console.log("res.locals.user:", res.locals.user); // Log para verificar que el usuario existe
    next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use('/api/sessions', sessionRoutes);



const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");
    
    try {
        const products = await productManager.getProducts();
        socket.emit("productos", products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }

    socket.on("eliminarProducto", async (id) => {
        console.log("ID recibido para eliminar desde socket:", id);
        try {
            await productManager.deleteProduct(id);
            const updatedProducts = await productManager.getProducts();
            io.emit("productos", updatedProducts);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });
});
