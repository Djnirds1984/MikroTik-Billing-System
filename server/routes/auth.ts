import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import authMiddleware, { AuthRequest } from '../authMiddleware';

const router = Router();
const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, tenantName } = req.body;

    if (!name || !email || !password || !tenantName) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create tenant and user in a transaction
        const client = await db.query('BEGIN');
        try {
            const tenantResult = await db.query(
                'INSERT INTO tenants (name) VALUES ($1) RETURNING id, name',
                [tenantName]
            );
            const newTenant = tenantResult.rows[0];

            const userResult = await db.query(
                'INSERT INTO users (name, email, password_hash, tenant_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, tenant_id',
                [name, email, passwordHash, newTenant.id]
            );
            const newUser = userResult.rows[0];

            await db.query('COMMIT');
            
            const token = jwt.sign({ id: newUser.id, tenantId: newUser.tenant_id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
            
            res.status(201).json({ 
                token, 
                user: { id: newUser.id, name: newUser.name, email: newUser.email, tenantId: newUser.tenant_id },
                tenant: { id: newTenant.id, name: newTenant.name }
            });

        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const user = userResult.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const tenantResult = await db.query('SELECT * FROM tenants WHERE id = $1', [user.tenant_id]);
        const tenant = tenantResult.rows[0];

        const token = jwt.sign({ id: user.id, tenantId: user.tenant_id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, tenantId: user.tenant_id },
            tenant: { id: tenant.id, name: tenant.name }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// GET /api/auth/me (Protected Route)
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;
        const userResult = await db.query('SELECT id, name, email, tenant_id FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = userResult.rows[0];
        
        const tenantResult = await db.query('SELECT id, name FROM tenants WHERE id = $1', [user.tenant_id]);
        const tenant = tenantResult.rows[0];

        res.json({ user, tenant });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


export default router;
