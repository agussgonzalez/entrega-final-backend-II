import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    // Estrategia de registro
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, age, role } = req.body; // Agregar 'role' aquí
        try {
            const userExists = await UserModel.findOne({ email: username });
            if (userExists) return done(null, false, { message: "Email ya está en uso." });

            // Aquí asignamos un rol predeterminado si no se proporciona
            const newUser = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password),
                role: role || 'user' // Asignar rol, por defecto 'user'
            };

            const result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));


    // Estrategia de login
    passport.use("login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email: email });
            if (!user) return done(null, false, { message: "Usuario no encontrado." });
            if (!isValidPassword(password, user)) return done(null, false, { message: "Contraseña incorrecta." });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
    
    passport.serializeUser((user, done) => {
        console.log("Serializing user:", user); // Agrega un log para verificar que el usuario es serializado
        done(null, user._id); // Serializa solo el ID del usuario
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            console.log("Deserialized user:", user); // Verifica que se deserializa correctamente
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
    
    
    

    // Estrategia JWT
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
        secretOrKey: "palabrasecretaparatoken"
    }, async (jwtPayload, done) => {
        try {
            const user = await UserModel.findById(jwtPayload.id);
            if (user) return done(null, user);
            return done(null, false);
        } catch (error) {
            return done(error);
        }
    }));
}

export default initializePassport;
