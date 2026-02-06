import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import userModel from '../dao/models/user.model.js';
import cartModel from '../dao/models/cart.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.utils.js';
import { JWT_SECRET, extractCookie } from '../utils/jwt.utils.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, email, age } = req.body;

                // Verificar si el usuario ya existe
                const existingUser = await userModel.findOne({ email: username });
                if (existingUser) {
                    console.log('El usuario ya existe');
                    return done(null, false, { message: 'El usuario ya existe' });
                }

                // Crear un carrito para el nuevo usuario
                const newCart = await cartModel.create({ products: [] });

                // Crear el nuevo usuario con la contraseña encriptada
                const newUser = await userModel.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password), // hashSync de bcrypt
                    cart: newCart._id,
                    role: 'user'
                });

                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                // Buscar usuario por email
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    console.log('Usuario no encontrado');
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                // Validar contraseña
                if (!isValidPassword(user, password)) {
                    console.log('Contraseña incorrecta');
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('current', new JWTStrategy(
        {
            // Extraer el JWT desde la cookie
            jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
            secretOrKey: JWT_SECRET
        },
        async (jwt_payload, done) => {
            try {
                const user = await userModel.findById(jwt_payload.id);
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

export default initializePassport;
