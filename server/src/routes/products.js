import express from 'express';
import { pool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  asyncHandler(async (_req, res) => {
    const [products] = await pool.execute('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  }),
);

router.post(
  '/',
  authenticate,
  authorize('Admin'),
  asyncHandler(async (req, res) => {
    const { name, category, sku, barcode, price, stock, image } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO products (name, category, sku, barcode, price, stock, image)
       VALUES (:name, :category, :sku, :barcode, :price, :stock, :image)`,
      { name, category, sku, barcode, price, stock, image },
    );
    res.status(201).json({ id: result.insertId, name, category, sku, barcode, price, stock, image });
  }),
);

router.put(
  '/:id',
  authenticate,
  authorize('Admin'),
  asyncHandler(async (req, res) => {
    const { name, category, sku, barcode, price, stock, image } = req.body;
    await pool.execute(
      `UPDATE products
       SET name = :name, category = :category, sku = :sku, barcode = :barcode, price = :price, stock = :stock, image = :image
       WHERE id = :id`,
      { id: req.params.id, name, category, sku, barcode, price, stock, image },
    );
    res.json({ id: Number(req.params.id), name, category, sku, barcode, price, stock, image });
  }),
);

router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  asyncHandler(async (req, res) => {
    await pool.execute('DELETE FROM products WHERE id = :id', { id: req.params.id });
    res.status(204).send();
  }),
);

export default router;
