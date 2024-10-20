import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/user.model.js";
import generateToken from "../utils/jsonwebtoken.js";
import { isUser } from '../middlewares/authMiddleware.js';
import { getCurrentUser } from '../controllers/userController.js';

const router = Router();

// Registro
router.post("/register", (req, res, next) => {
    passport.authenticate("register", { session: true }, (err, user, info) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(400).send(info.message);
        
        const token = generateToken({ id: user._id });
        res.cookie("jwt", token, { httpOnly: true });
        
        return res.redirect("/login");
    })(req, res, next);
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("login", { session: false }, (err, user, info) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(400).send(info.message);

        const token = generateToken({ id: user._id });

        console.log("Generando JWT y configurando cookie..."); // Debug

        // Configura la cookie JWT
        res.cookie("jwt", token, {
            httpOnly: true, // Para prevenir acceso desde JavaScript
            secure: true,   // Cambia esto a true si estás usando HTTPS
             sameSite: "lax"
        });

        req.session.username = user.first_name;

        return res.redirect("/products");
    })(req, res, next);
});



// Ruta para obtener el usuario actual
router.get("/current", isUser, getCurrentUser, passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json(req.user);
});

export default router;
