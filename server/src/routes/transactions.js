import express from 'express';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  asyncHandler(async (_req, res) => {
    const [transactions] = await pool.execute(
      `SELECT t.*, u.name AS cashier_name
       FROM transactions t
       LEFT JOIN users u ON u.id = t.cashier_id
       ORDER BY t.created_at DESC`,
    );
    const [items] = await pool.execute('SELECT * FROM transaction_items ORDER BY id ASC');
    const itemsByTransaction = items.reduce((grouped, item) => {
      grouped[item.transaction_id] = grouped[item.transaction_id] || [];
      grouped[item.transaction_id].push({
        id: item.product_id,
        name: item.product_name,
        qty: item.qty,
        price: Number(item.price),
      });
      return grouped;
    }, {});

    res.json(
      transactions.map((transaction) => ({
        ...transaction,
        items: itemsByTransaction[transaction.id] || [],
      })),
    );
  }),
);

router.post(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { items, paymentMethod, paid, total, change } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Item transaksi wajib diisi.' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [transactionResult] = await connection.execute(
        `INSERT INTO transactions (cashier_id, payment_method, paid, total, change_amount)
         VALUES (:cashierId, :paymentMethod, :paid, :total, :changeAmount)`,
        {
          cashierId: req.user.id,
          paymentMethod,
          paid,
          total,
          changeAmount: change,
        },
      );

      const transactionId = transactionResult.insertId;

      for (const item of items) {
        await connection.execute(
          `INSERT INTO transaction_items (transaction_id, product_id, product_name, qty, price, subtotal)
           VALUES (:transactionId, :productId, :productName, :qty, :price, :subtotal)`,
          {
            transactionId,
            productId: item.id,
            productName: item.name,
            qty: item.qty,
            price: item.price,
            subtotal: item.qty * item.price,
          },
        );
        await connection.execute('UPDATE products SET stock = stock - :qty WHERE id = :productId AND stock >= :qty', {
          productId: item.id,
          qty: item.qty,
        });
      }

      await connection.commit();
      res.status(201).json({ id: transactionId, items, paymentMethod, paid, total, change });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }),
);

export default router;
