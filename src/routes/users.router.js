import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/user.model.js';
import { createHash } from '../utils/bcrypt.utils.js';

const router = Router();

// Middleware de autenticación JWT reutilizable
const authJWT = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
        if (err) return res.status(500).json({ status: 'error', error: err.message });
        if (!user) return res.status(401).json({ status: 'error', error: 'No autorizado' });
        req.user = user;
        next();
    })(req, res, next);
};

// Middleware para verificar rol admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ status: 'error', error: 'Acceso denegado: se requiere rol admin' });
    }
    next();
};

// ==========================================
// GET /api/users - Obtener todos los usuarios
// ==========================================
router.get('/', authJWT, isAdmin, async (req, res) => {
    try {
        const users = await userModel.find().select('-password').lean();
        res.json({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// ==========================================
// GET /api/users/:uid - Obtener usuario por ID
// ==========================================
router.get('/:uid', authJWT, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.uid).select('-password').lean();
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
        }
        res.json({ status: 'success', payload: user });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// ==========================================
// PUT /api/users/:uid - Actualizar usuario
// ==========================================
router.put('/:uid', authJWT, async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        const updateData = {};
        if (first_name) updateData.first_name = first_name;
        if (last_name) updateData.last_name = last_name;
        if (email) updateData.email = email;
        if (age) updateData.age = age;
        if (password) updateData.password = createHash(password);
        // Solo un admin puede cambiar el rol
        if (role && req.user.role === 'admin') updateData.role = role;

        const updatedUser = await userModel
            .findByIdAndUpdate(req.params.uid, updateData, { new: true })
            .select('-password')
            .lean();

        if (!updatedUser) {
            return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
        }

        res.json({ status: 'success', message: 'Usuario actualizado', payload: updatedUser });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// ==========================================
// DELETE /api/users/:uid - Eliminar usuario
// ==========================================
router.delete('/:uid', authJWT, isAdmin, async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.uid);
        if (!deletedUser) {
            return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
        }
        res.json({ status: 'success', message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

export default router;
