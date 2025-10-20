import { Router as ExpressRouter } from 'express';
import pool from '../db';
import authMiddleware, { AuthRequest } from '../authMiddleware';

const router = ExpressRouter();

// All routes in this file are protected
router.use(authMiddleware);

// GET /api/routers
router.get('/', async (req: AuthRequest, res) => {
    const tenantId = req.user?.tenantId;
    try {
        const result = await pool.query('SELECT id, name, ip, username FROM routers WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Get routers error:', error);
        res.status(500).json({ message: 'Failed to fetch routers' });
    }
});

// POST /api/routers
router.post('/', async (req: AuthRequest, res) => {
    const tenantId = req.user?.tenantId;
    const { name, ip, username, password } = req.body;

    if (!name || !ip || !username) {
        return res.status(400).json({ message: 'Name, IP, and Username are required.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO routers (name, ip, username, password, tenant_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, ip, username',
            [name, ip, username, password, tenantId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Add router error:', error);
        res.status(500).json({ message: 'Failed to add router' });
    }
});

// PUT /api/routers/:id
router.put('/:id', async (req: AuthRequest, res) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { name, ip, username, password } = req.body;

    if (!name || !ip || !username) {
        return res.status(400).json({ message: 'Name, IP, and Username are required.' });
    }

    try {
        const result = await pool.query(
            'UPDATE routers SET name = $1, ip = $2, username = $3, password = $4 WHERE id = $5 AND tenant_id = $6 RETURNING id, name, ip, username',
            [name, ip, username, password, id, tenantId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Router not found or you do not have permission to edit it.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update router error:', error);
        res.status(500).json({ message: 'Failed to update router' });
    }
});

// DELETE /api/routers/:id
router.delete('/:id', async (req: AuthRequest, res) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM routers WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Router not found or you do not have permission to delete it.' });
        }
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Delete router error:', error);
        res.status(500).json({ message: 'Failed to delete router' });
    }
});

export default router;