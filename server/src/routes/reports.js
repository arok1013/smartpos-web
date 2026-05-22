import express from 'express';
import { pool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get(
  '/sales',
  authenticate,
  authorize('Admin'),
  asyncHandler(async (req, res) => {
    const range = req.query.range || 'daily';
    const interval = range === 'monthly' ? '1 MONTH' : range === 'weekly' ? '7 DAY' : '1 DAY';

    const [summary] = await pool.query(
      `SELECT COUNT(*) AS total_transactions, COALESCE(SUM(total), 0) AS total_income
       FROM transactions
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`,
    );

    const [payments] = await pool.query(
      `SELECT payment_method, COALESCE(SUM(total), 0) AS total
       FROM transactions
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY payment_method`,
    );

    const [bestProducts] = await pool.query(
      `SELECT product_name, SUM(qty) AS sold
       FROM transaction_items ti
       JOIN transactions t ON t.id = ti.transaction_id
       WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
       GROUP BY product_name
       ORDER BY sold DESC
       LIMIT 10`,
    );

    res.json({ summary: summary[0], payments, bestProducts });
  }),
);

export default router;
