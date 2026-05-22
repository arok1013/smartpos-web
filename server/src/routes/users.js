import bcrypt from 'bcryptjs';
import express from 'express';
import { pool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize('Admin'),
  asyncHandler(async (_req, res) => {
    const [users] = await pool.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  }),
);

router.post(
  '/',
  authenticate,
  authorize('Admin'),
  asyncHandler(async (req, res) => {
    const { name, email, password, role = 'Kasir' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
    }

    if (!['Admin', 'Kasir'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (:name, :email, :passwordHash, :role)',
        { name, email, passwordHash, role },
      );
      res.status(201).json({ id: result.insertId, name, email, role });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email sudah terdaftar.' });
      }
      throw error;
    }
  }),
);

export default router;
