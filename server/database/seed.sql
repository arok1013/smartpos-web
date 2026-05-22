USE smartpos_db;

-- Password semua akun default: password
INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin Toko', 'admin@smartpos.test', '$2a$10$GSmRIKlz8IgCWJZY4zsKi.jDVA5XnOY4fFO7NZ9CRIF1bnSXmpo5q', 'Admin'),
  ('Kasir Toko', 'kasir@smartpos.test', '$2a$10$GSmRIKlz8IgCWJZY4zsKi.jDVA5XnOY4fFO7NZ9CRIF1bnSXmpo5q', 'Kasir')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO products (name, category, sku, barcode, price, stock, image)
VALUES
  ('Beras Premium 5kg', 'Sembako', 'SMB-BRS-5KG', '899100000001', 72000, 18, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80'),
  ('Minyak Goreng 2L', 'Sembako', 'SMB-MNY-2L', '899100000002', 38500, 9, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80'),
  ('Kopi Susu Botol', 'Minuman', 'MNM-KOP-BTL', '899100000003', 12000, 42, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'),
  ('Sabun Mandi', 'Perawatan', 'PRW-SBN-001', '899100000004', 6500, 6, 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=400&q=80'),
  ('Mi Instan Goreng', 'Makanan', 'MKN-MIG-001', '899100000005', 3500, 75, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80')
ON DUPLICATE KEY UPDATE name = VALUES(name), stock = VALUES(stock);
