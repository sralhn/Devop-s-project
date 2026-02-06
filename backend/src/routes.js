const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    registerForEvent,
    unregisterFromEvent,
    getAllUsers,
    getAllRegistrations,
    deleteEvent,
    deleteUser,
    toggleBlockStatus,
    changeUserRole
} = require('./controllers');

const {
    register,
    registerValidation,
    verifyEmail,
    resendVerification,
    resendVerificationValidation,
    login,
    loginValidation,
    getProfile
} = require('./auth.controller');

const { authenticateToken, requireAdmin } = require('./auth.middleware');

// Auth Routes
router.post('/auth/register', registerValidation, register);
router.get('/auth/verify-email/:token', verifyEmail);
router.post('/auth/resend-verification', resendVerificationValidation, resendVerification);
router.post('/auth/login', loginValidation, login);
router.get('/auth/profile', authenticateToken, getProfile);

// Event Routes (public read, protected create)
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', authenticateToken, createEvent); // Protected
router.put('/events/:id', authenticateToken, updateEvent); // Protected

// Registration Routes (protected)
router.post('/events/:id/register', authenticateToken, registerForEvent);
router.post('/events/:id/unregister', authenticateToken, unregisterFromEvent);

// Admin Routes (protected, admin only)
router.get('/admin/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/admin/registrations', authenticateToken, requireAdmin, getAllRegistrations);
router.delete('/admin/events/:id', authenticateToken, requireAdmin, deleteEvent);
router.delete('/admin/users/:id', authenticateToken, requireAdmin, deleteUser);
router.put('/admin/users/:id/block', authenticateToken, requireAdmin, toggleBlockStatus);
router.put('/admin/users/:id/role', authenticateToken, requireAdmin, changeUserRole);

module.exports = router;
