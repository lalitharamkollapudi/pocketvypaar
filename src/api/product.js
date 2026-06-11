// src/api/product.js
// Vercel serverless functions for product management
// This file exports handlers for GET, POST, PUT, DELETE and bulk import

import { promises as fs } from 'fs';
import path from 'path';

// Simple JSON file storage (for demo). In production replace with DB.
const DB_PATH = path.resolve(process.cwd(), 'data', 'products.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    // If file missing, start with empty array
    return [];
  }
}

async function writeDB(products) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

export default async function handler(req, res) {
  const { method, query } = req;
  const products = await readDB();

  // GET /api/product -> list, supports ?search=&category=&lowStock=true
  if (method === 'GET') {
    const { search, category, lowStock } = query;
    let result = products;
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term) || p.barcode.includes(term));
    }
    if (category) {
      result = result.filter(p => p.category === category);
    }
    if (lowStock === 'true') {
      result = result.filter(p => p.stock <= 5);
    }
    return res.status(200).json({ success: true, data: result });
  }

  // POST /api/product -> create new product
  if (method === 'POST') {
    const { name, category, price, barcode, stock } = req.body;
    const id = `prd_${Date.now()}`;
    const newProduct = { id, name, category, price, barcode, stock: Number(stock) || 0 };
    products.push(newProduct);
    await writeDB(products);
    return res.status(201).json({ success: true, data: newProduct });
  }

  // PUT /api/product/:id -> update
  if (method === 'PUT') {
    const { id } = query; // id passed as query param
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Product not found' });
    const updated = { ...products[index], ...req.body };
    products[index] = updated;
    await writeDB(products);
    return res.status(200).json({ success: true, data: updated });
  }

  // DELETE /api/product/:id
  if (method === 'DELETE') {
    const { id } = query;
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return res.status(404).json({ success: false, error: 'Product not found' });
    await writeDB(filtered);
    return res.status(200).json({ success: true });
  }

  // POST /api/product/bulk-import -> expects multipart/form-data with CSV file (handled elsewhere)
  if (method === 'POST' && query.action === 'bulk-import') {
    // Placeholder – actual implementation will be done in a separate handler using next-connect.
    return res.status(200).json({ success: true, message: 'Bulk import not yet implemented' });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
