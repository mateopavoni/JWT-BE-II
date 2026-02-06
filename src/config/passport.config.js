import passport from 'passport';
import local from 'passport-local';
import userModel from '../dao/models/user.model.js';
import cartModel from '../dao/models/cart.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.utils.js';


const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, email, age } = req.body;

                const existingUser = await userModel.findOne({ email: username });
                if (existingUser) {
                    return done(null, false);
                }

                const newCart = await cartModel.create({ products: [] });

                const newUser = await userModel.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id,
                    role: 'user'
                });

                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

passport.use('login', new LocalStrategy(
    {
        usernameField: 'email'
    },
    async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


export default initializePassport;
