import { Router } from 'express';
import passport from 'passport';
import { generateToken, JWT_COOKIE_NAME } from '../utils/jwt.utils.js';

const router = Router();

// POST /api/sessions/register
router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ status: 'error', error: err.message });
        }
        if (!user) {
            return res.status(400).json({ status: 'error', error: info?.message || 'Error al registrar usuario' });
        }

        // Generar token JWT y guardarlo en cookie
        const token = generateToken(user);
        res.cookie(JWT_COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        return res.status(201).json({
            status: 'success',
            message: 'Usuario registrado exitosamente',
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart,
                role: user.role
            }
        });
    })(req, res, next);
});

// POST /api/sessions/login
router.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ status: 'error', error: err.message });
        }
        if (!user) {
            return res.status(401).json({ status: 'error', error: info?.message || 'Credenciales inválidas' });
        }

        // Generar token JWT y guardarlo en cookie
        const token = generateToken(user);
        res.cookie(JWT_COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            status: 'success',
            message: 'Login exitoso',
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart,
                role: user.role
            }
        });
    })(req, res, next);
});

// GET /api/sessions/current
// Valida el usuario logueado mediante JWT

router.get('/current', (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ status: 'error', error: err.message });
        }
        if (!user) {
            return res.status(401).json({
                status: 'error',
                error: info?.message || 'No autorizado: token inválido o inexistente'
            });
        }

        return res.json({
            status: 'success',
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart,
                role: user.role
            }
        });
    })(req, res, next);
});

// POST /api/sessions/logout
router.post('/logout', (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME);
    return res.json({ status: 'success', message: 'Logout exitoso' });
});

export default router;
