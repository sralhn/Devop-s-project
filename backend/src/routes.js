const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    registerForEvent,
    unregisterFromEvent,
    getAllUsers,
    getAllRegistrations,
    deleteEvent
} = require('./controllers');

const {
    register,
    registerValidation,
    login,
    loginValidation,
    getProfile
} = require('./auth.controller');

const { authenticateToken, requireAdmin } = require('./auth.middleware');

// Auth Routes
router.post('/auth/register', registerValidation, register);
router.post('/auth/login', loginValidation, login);
router.get('/auth/profile', authenticateToken, getProfile);

// Event Routes (public read, protected create)
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', authenticateToken, createEvent); // Protected

// Registration Routes (protected)
router.post('/events/:id/register', authenticateToken, registerForEvent);
router.post('/events/:id/unregister', authenticateToken, unregisterFromEvent);

// Admin Routes (protected, admin only)
router.get('/admin/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/admin/registrations', authenticateToken, requireAdmin, getAllRegistrations);
router.delete('/admin/events/:id', authenticateToken, requireAdmin, deleteEvent);

module.exports = router;
