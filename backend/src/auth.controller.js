const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const prisma = require('./prisma');
const { JWT_SECRET } = require('./auth.middleware');
const { sendVerificationEmail } = require('./services/email.service');

/**
 * Authentication Controller
 * 
 * Academic Note: This controller handles user authentication with email verification.
 * Security principle: NO JWT token is issued until email is verified.
 */

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
    body('name').notEmpty().withMessage('Name is required')
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required')
];

const resendVerificationValidation = [
    body('email').isEmail().withMessage('Valid email required')
];

/**
 * Register new user
 * 
 * Security Flow:
 * 1. Create user with emailVerified = false
 * 2. Generate secure verification token
 * 3. Send verification email
 * 4. Return success message (NO JWT token)
 */
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate secure verification token
        // Academic Note: crypto.randomBytes provides cryptographically secure random data
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Set expiration to 24 hours from now
        const verificationExpires = new Date();
        verificationExpires.setHours(verificationExpires.getHours() + 24);

        // Create user with email verification fields
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER',
                emailVerified: false,
                verificationToken,
                verificationExpires
            }
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken, name);

        // Academic Note: We do NOT return a JWT token here
        // User must verify email before they can login
        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.',
            email: user.email
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * Verify email address
 * 
 * Security Flow:
 * 1. Find user by verification token
 * 2. Check if token is expired
 * 3. Mark email as verified
 * 4. Clear verification token
 */
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Find user with this verification token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        // Check if token is expired
        if (user.verificationExpires && new Date() > user.verificationExpires) {
            return res.status(400).json({
                error: 'Verification token has expired',
                canResend: true
            });
        }

        // Check if already verified
        if (user.emailVerified) {
            return res.status(200).json({
                message: 'Email already verified. You can login now.',
                alreadyVerified: true
            });
        }

        // Mark email as verified and clear verification token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationExpires: null
            }
        });

        res.json({
            message: 'Email verified successfully! You can now login.',
            verified: true
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: 'Email verification failed' });
    }
};

/**
 * Resend verification email
 * 
 * Security Note: Rate limiting should be implemented in production
 */
const resendVerification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Don't reveal if email exists or not (security best practice)
            return res.json({
                message: 'If an account exists with this email, a verification link will be sent.'
            });
        }

        // Check if already verified
        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date();
        verificationExpires.setHours(verificationExpires.getHours() + 24);

        // Update user with new token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationExpires
            }
        });

        // Send new verification email
        await sendVerificationEmail(email, verificationToken, user.name);

        res.json({
            message: 'Verification email sent! Please check your inbox.'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ error: 'Failed to resend verification email' });
    }
};

/**
 * Login user
 * 
 * Security Flow:
 * 1. Verify password
 * 2. Check if email is verified
 * 3. Only issue JWT if email is verified
 */
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({
                error: 'Your account has been blocked. Please contact support.'
            });
        }

        // Academic Note: CRITICAL SECURITY CHECK
        // We check if email is verified before issuing JWT token
        if (!user.emailVerified) {
            return res.status(403).json({
                error: 'Please verify your email before logging in',
                emailNotVerified: true,
                email: user.email
            });
        }

        // Generate JWT token (only if email is verified)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                emailVerified: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

/**
 * Seed default admin user
 * 
 * Academic Note: Admin users created via seed are pre-verified
 * This allows immediate access for administrative purposes
 */
const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@admin.com';
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: 'Administrator',
                    role: 'ADMIN',
                    emailVerified: true  // Admin is pre-verified
                }
            });
            console.log('✅ Default admin user created (pre-verified)');
        }
    } catch (error) {
        console.error('Failed to seed admin:', error);
    }
};

module.exports = {
    register,
    registerValidation,
    verifyEmail,
    resendVerification,
    resendVerificationValidation,
    login,
    loginValidation,
    getProfile,
    seedAdmin
};
