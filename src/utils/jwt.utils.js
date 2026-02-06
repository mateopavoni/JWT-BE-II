import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'coderCookieToken';

// Generar token JWT
export const generateToken = (user) => {
    const token = jwt.sign(
        {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            cart: user.cart,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    return token;
};

// Verificar token JWT (uso general)
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Extraer token de la cookie
export const extractCookie = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[JWT_COOKIE_NAME];
    }
    return token;
};

export { JWT_SECRET, JWT_COOKIE_NAME };
